import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-errors.js";
import jwt from "jsonwebtoken";
import config from "../configs/config.js";
import { User } from "../models/user.models.js";
import {Session} from "../models/session.models.js";

const loginVerification = asyncHandler(async function(req, res, next) {
    // *1. validate Authorization header*
    const authHeader = req.headers.authorization;
    console.log("authHeader", authHeader);

    // 2. return res if authHeader not exist
    if (!authHeader) {
        return res.status(400).json(new ApiResponse(400, "Access token is required"));
    }

    // *3. Get access token from Authorization header*
    const token = authHeader.split(" ")[1];

    // 4. return res if token is invalid
    if(!token) {
        return res.status(400).json(new ApiResponse(400, "Access token is required"));
    }

    // 5. verify token using jwt
    let decoded;
    try {
        decoded = jwt.verify(token, config.ACCESS_TOKEN_SECRET);
        console.log("decoded", decoded);
    } catch (error) {
        throw new ApiError(400, "Invalid access token", error);
    }

    // 6. destructure userId from token
    const {_id: userId, sessionId} = decoded;

    // find session based on sessionId
    const session = await Session.findById(sessionId);

    // return res if session not found
    if(!session) {
        return res.status(401).json(new ApiResponse(401, "Invalid session. Please login to access profile"));
    }

    // check session.revokedAt is revoked
    if(session.revokedAt) {
        return res.status(401).json(new ApiResponse(401, "Session is revoked. Please login to access profile"));
    }

    // 7. find user based on userId
    const user = await User.findById(userId);
    console.log("user", user);
    
    // 8. return res if user not found
    if(!user) {
        return res.status(400).json(new ApiResponse(400, "User not found"));
    }

    // 9. add this user inside req object as a key
    req.user = user;

    next();
})

export { loginVerification }
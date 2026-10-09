import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { User } from "../models/user.models.js";
import { UserRolesEnum } from "../utils/constants.js";
import { sendMail, emailVerificationMailgenContent, resetPasswordVerificationMailgenContent } from "../utils/mail.js";
import config from "../configs/config.js";
import { ApiError } from "../utils/api-errors.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import {Session} from "../models/session.models.js";
import jwt from "jsonwebtoken";


const healthCheckRoute = asyncHandler(async (req, res) => {
    res.status(200).json(new ApiResponse(200, "Route is working"));
})

const userRegister = asyncHandler(async (req, res) => {
    // 1. get data from user
    const { name, email, password, role } = req.body;
    console.log(`name: ${name} password: ${password} email: ${email} role: ${role}`);

    // 2. validate using validator

    // 3. check existing user
    const existingUser = await User.findOne({ email });
    console.log("existingUser", existingUser);


    // 4. send message if user already exist
    if (existingUser) {
        return res.status(400).json(new ApiResponse(400, "User already existing"));
    }

    // 5. create a user in database
    const user = await User.create({
        name,
        email,
        password,
        role: role || UserRolesEnum.USER,
    })
    console.log("user", user);


    // 6. get token
    const { unHashedToken, hashedToken, tokenExpiry } = user.generateTemporaryToken();
    console.log("token", unHashedToken, hashedToken, tokenExpiry);

    // 7. assign hashedToken and tokenExpiry in DB till user clicks on email verification link
    user.verificationToken = hashedToken;
    user.verificationTokenExpiry = tokenExpiry;
    await user.save({ validateBeforeSave: false });

    // 8. send email to the user
    sendMail({
        email: user?.email,
        subject: "Please verify your email",
        mailgenContent: emailVerificationMailgenContent(
            name,
            `${config.BASE_URL}/api/v1/users/verify-email/${unHashedToken}`
        )
    });

    const createdUser = await User.findById(user._id).select("-password -verificationToken -verificationTokenExpiry");
    console.log("createdUser", createdUser);

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    res.status(201).json(new ApiResponse(201, "User register successfully and verification email has been sent on your email", {user: createdUser}));

});

const userVerification = asyncHandler( async (req, res) => {
    // 1. get token from user
    const {token} = req.params;
    console.log("token", token);

    // 2. validate token using express validator

    // 3. hashed token
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    console.log("hashedToken", hashedToken);
    
    // 4. find user based on token
    const user = await User.findOne({verificationToken: hashedToken});
    console.log("userverification", user);

    // 5. return message if user not found
    if(!user) {
        return res.status(400).json(new ApiResponse(400, "Verification token is not valid"));
    }

    // 6. check verification token is expiry or not
    if( !(user.verificationTokenExpiry >= Date.now()) ) {
        return res.status(400).json(new ApiResponse(400, "Token has expired"));
    }

    // 7. update isVerified = true in DB
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    // 8. send res 
    res.status(200).json(new ApiResponse(200, "User verified successfully!!"));
})

const userLogin = asyncHandler(async (req, res) => {
    // 1. get data from user
    const {email, password} = req.body;
    console.log("email", email, "password", password);
    

    // 2. validate using a express-validator

    // 3. find user based on email
    const user = await User.findOne({email});
    console.log("user", user);
    
    // 4. return res if user not found
    if(!user) {
        return res.status(400).json(new ApiResponse(400, "Invalid email or password"));
    }

    // 5. compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("isPasswordValid", isPasswordValid);

    // 6. return res if password not match
    if(!isPasswordValid) {
        return res.status(400).json(new ApiResponse(400, "Invalid email or password"));
    }

    // 7. check user is verified
    if(!user.isVerified) {
        return res.status(400).json(new ApiResponse(400, "Invalid user"));
    }

    // 8. create a session
    const session = new Session({
        user: user._id,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
        expiresAt: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)),
        revokedAt: null,
    })
    console.log("session", session);

    // 9. generate refresh token
    const unHashedRefreshToken = user.generateRefreshToken(session);
    const hashedRefreshToken = crypto.createHash("sha256").update(unHashedRefreshToken).digest("hex");
    console.log("unHashedRefreshToken", unHashedRefreshToken, "hashedRefreshToken", hashedRefreshToken);
    
    // 10. set refresh token inside session
    session.refreshToken = hashedRefreshToken;
    await session.save();

    //11. set cookies in browser
    res.cookie("refreshToken", unHashedRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7days
    })

    // 12. generate a access token
    const accessToken = user.generateAccessToken(session);
    console.log("accessToken", accessToken);
    
    // 13. send res
    res.status(200).json(new ApiResponse(200, "User login successfully!!", accessToken));
});

const refreshToken = asyncHandler( async (req, res) => {
    // 1. get refresh token from cookie
    const {refreshToken} = req.cookies;
    console.log("refreshToken", refreshToken);

    // 2. validate token using express validator

    // 3. verify refresh token
    const decoded = jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET);
    console.log("decoded", decoded);
    
    // 4. return res if refresh token is wrong or expired
    if(!decoded) {
        return res.status(401).json(new ApiResponse(401, "Invalid or expired refresh token"));
    }

    // 5. Get user ID and session ID
    const {_id: userId, sessionId} = decoded;
    console.log("_id:", userId, "sessionId", sessionId);
    
    // 6. hashed token
    const hashedRefreshToken = crypto.createHash("sha256").update(refreshToken).digest("hex");
    console.log("hashedRefreshToken", hashedRefreshToken);
    
    // 7. find session based on session id
    const session = await Session.findById(sessionId);
    console.log("session", session);
    
    // 8. return res if session not find
    if(!session) {
        return res.status(401).json(new ApiResponse(401, "Session not found"));
    }

    // 9. check session belongs to the user
    if(session.user.toString() !== userId.toString()) {
        throw new ApiError(401, "Invalid session");
    }

    // 10. check session is revoked
    if(session.revokedAt) {
        throw new ApiError(401, "Session has been revoked");
    }

    // 11. check session expiration
    if(session.expiresAt <= new Date()) {
        throw new ApiError(401, "Session has expired")
    }

    // 12. compare refresh token hash
    if(session.refreshToken !== hashedRefreshToken) {
        throw new ApiError(401, "Invalid refresh token")
    }

    // 13. find user using userId
    const user = await User.findById(userId);
    console.log("user", user);

    // 14. return res if user not found
    if(!user) {
        return res.status(400).json(new ApiResponse(400, "User not found"));
    }

    // 15. generate new access token 
    const newAccessToken = user.generateAccessToken(session);
    console.log("newAccessToken", newAccessToken);
    
    // 16 . generate new refresh token
    const newRefreshToken = user.generateRefreshToken(session);
    const hashedNewRefreshToken = crypto.createHash("sha256").update(newRefreshToken).digest("hex");
    console.log("newRefreshToken", newRefreshToken, "hashedNewRefreshToken", hashedNewRefreshToken);
    
    // 17. save hashed refresh token in session
    session.refreshToken = hashedNewRefreshToken;
    await session.save();

    // 18. set unhashed token inside cookie
    res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7days
    })

    // 19. send access token to the user using response
    res.status(200).json(new ApiResponse(200, "Access token refreshed successfully!!", newAccessToken));
})

const userLogout = asyncHandler(async (req, res) => {
    // 1. get refresh token from cookies
    const {refreshToken} = req.cookies;
    console.log("refreshToken", refreshToken);
    
    // 2. validate cookies
    if(!refreshToken) {
        res.clearCookie("refreshToken");
        return res.status(200).json(new ApiResponse(200, "You are already logout."));
    }
    
    let decoded;
    try {
        // 3. verify token using jwt
        decoded = jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET);
        console.log("decoded", decoded);
        
    } catch (error) {
        res.clearCookie("refreshToken");
        return res.status(200).json(new ApiResponse(200, "You are already logout."));
    }

    // 5. destructre sessionId and userId
    const {sessionId} = decoded;
    console.log("sessionId: ", sessionId);
    
    // 6. find session based on sessionId
    const session = await Session.findById(sessionId);
    console.log("session", session);
    

    if(!session) {
        res.clearCookie("refreshToken");
        return res.status(200).json(new ApiResponse(200, "You are already logout."));
    }
    // 7. update session model session.refreshToken = null, session.revoked = new Date()
    session.refreshToken = null;
    session.revokedAt = new Date();
    await session.save();

    // 8. remove refreshToken inside cookies
    res.clearCookie("refreshToken");

    // 9. send response user logout successfully
    res.status(200).json(new ApiResponse(200, "User logout successfully!!"));
})

const userProfile = asyncHandler( async (req, res) => {
    // 1. get user from req
    const user = req.user;
    console.log("user", user);

    // 2. get user with a specific details
    const createdUser = await User.findById(user._id).select("-password");
    console.log("createdUser", createdUser);
    
    // 3. send res 
    res.status(200).json(new ApiResponse(200, "User get profile successfully!!", createdUser));
})

const resendVerificationEmail = asyncHandler( async(req, res) => {  
    // *1. Get email from request body*
    const {email} = req.body;
    console.log("email", email);
    
    // *2. Validate email using express-validator*

    // *3. Find user based on email*
    const user = await User.findOne({email});
    console.log("user", user);
    
    // *4. Return response if user not found*
    if(!user) {
        return res.status(400).json(new ApiResponse(400, "Invalid email"));
    }

    // *5. Check if user's email is already verified*
    if(user.isVerified) {
        return res.status(400).json(new ApiResponse(400, "User is already verified"));
    }

    // *6. Generate new verification token*
    const {unHashedToken, hashedToken, tokenExpiry} = user.generateTemporaryToken();
    console.log("token", unHashedToken, hashedToken, tokenExpiry);

    // *7. Set hashed token and expiry in User model*
    user.verificationToken = hashedToken;
    user.verificationTokenExpiry = tokenExpiry;

    // *8. Save user model*
    await user.save();

    // *9. Send email using unhashed verification token*
    await sendMail({
        email: user.email,
        subject: "Please verify your email",
        mailgenContent: emailVerificationMailgenContent(user.name, `${config.BASE_URL}/api/v1/users/verify-email/${unHashedToken}`)
    })

    // *10. Send response*
    res.status(200).json(new ApiResponse(200, "Resend verification email is successfully completed!!"));
    
})

const changeUserPassword = asyncHandler(async (req, res) => {
    // *1. Get user from req.user*

    // *2. Get old and new password from body*

    // *3. Compare old password with stored password*

    // *4. Return response if old password is wrong*

    // *5. Hash new password*

    // *6. Update password in User model*

    // *7. Save user*

    // *8. Find current session*

    // *9. Return response if session not found*

    // *10. Revoke current session*

    // *11. Send password changed email*

    // *12. Send response*
})

const forgotPassword = asyncHandler(async (req, res) => {
    // 1. get email from body
    const {email} = req.body;
    console.log("email", email);
    
    // 2. validate email
    if(!email) {
        throw new ApiError(400, "Invalid user");
    }

    // 3. find user based on email
    const user = await User.findOne({email});
    console.log("user", user);
    
    // 4. throw error if user not found
    if(!user) {
        throw new ApiError(500, "User not found in database");
    }
    // 5. generate a token
    const token = crypto.randomBytes(32).toString("hex");
    
    // 6. hash the token
    const hashToken = crypto.createHash("sha256").update(token).digest("hex");

    // 7. save a token in db
    user.resetPasswordToken = hashToken;
    user.resetPasswordExpiry = Date.now() + 15 * 60 * 1000;
    await user.save();

    // 8. send email to the user
    sendMail({
        email: user?.email,
        subject: "Please reset your password",
        mailgenContent: resetPasswordVerificationMailgenContent(
            user.name,
            `${config.BASE_URL}/api/v1/users/reset-password/${token}`
        )
    });

    // 9. send token to the user
    res.status(200).json(new ApiResponse(200, "User forgot password successfully"));

})

export { healthCheckRoute, userRegister, userVerification, userLogin, refreshToken, userLogout, userProfile, resendVerificationEmail, forgotPassword }
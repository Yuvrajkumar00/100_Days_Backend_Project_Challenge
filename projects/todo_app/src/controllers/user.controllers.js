import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { User } from "../models/user.models.js";
import { UserRolesEnum } from "../utils/constants.js";
import { sendMail, emailVerificationMailgenContent } from "../utils/mail.js";
import config from "../configs/config.js";
import { ApiError } from "../utils/api-errors.js";
import crypto from "crypto";


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


export { healthCheckRoute, userRegister, userVerification }
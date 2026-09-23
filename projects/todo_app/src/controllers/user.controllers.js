import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { User } from "../models/user.models.js";
import { UserRolesEnum } from "../utils/constants.js";
import { sendMail, emailVerificationMailgenContent } from "../utils/mail.js";
import config from "../configs/config.js";
import { ApiError } from "../utils/api-errors.js";


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



export { healthCheckRoute, userRegister }
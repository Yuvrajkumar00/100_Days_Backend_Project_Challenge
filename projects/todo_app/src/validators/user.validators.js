import {body, param} from "express-validator";
import {AvailableUserRoles} from "../utils/constants.js";

const userRegisterationValidator = () => {
    return [
        body("name")
            .trim()
            .notEmpty().withMessage("Username is required")
            .isLowercase().withMessage("Username must be lowercase")
            .isLength({min: 3}).withMessage("Username must be at lease 3 characters long"),
        body("email")
            .trim()
            .isLowercase().withMessage("Email must be lowercase")
            .notEmpty().withMessage("Email is required")
            .isEmail().withMessage("Email is invalid"),
        body("password")
            .trim()
            .isLength({min: 8}).withMessage("Password must be at lease 8 character")
            .notEmpty().withMessage("Password is required"),
        body("role")
            .optional()
            .isIn(AvailableUserRoles).withMessage("Invalid user role")
    ]
}

const userLoginValidator = () => {
    return [
        body("password")
            .notEmpty().withMessage("Password is required"),
        body("email")
            .notEmpty().withMessage("Email is required")
            .isEmail().withMessage("Email is invalid")
            .isLowercase().withMessage("Email must be lowercase")   
    ]
}

    const userVerificationValidator = () => {
        return [
            param("token")
                .notEmpty().withMessage("Verification token is required")
        ]
    }

export {userRegisterationValidator, userLoginValidator, userVerificationValidator}
import mongoose, {Schema} from "mongoose";
import {AvailableUserRoles, UserRolesEnum} from "../utils/constants.js";

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    role: {
        type: String,
        enum: AvailableUserRoles,
        default: UserRolesEnum.USER,
    },
    profile: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String,
    }

}, {timestamps: true});

export const User = mongoose.model("User", userSchema);

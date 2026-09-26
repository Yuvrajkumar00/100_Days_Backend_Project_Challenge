import mongoose, {Schema} from "mongoose";

const sessionSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    refreshToken: {
        type: String,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
    revokedAt: {
        type: Date,
        default: null,
    },
    userAgent: {
        type: String,
    },
    ip: {
        type: String,
    },

}, {timestamps: true});

export const Session = mongoose.model("Session", sessionSchema);
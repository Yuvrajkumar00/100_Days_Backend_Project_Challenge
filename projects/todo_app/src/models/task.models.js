import mongoose, {Schema} from "mongoose";
import {TodoStatusEnum, AvailableTodoStatuses, AvailableTodoPriorities, TodoPriorityEnum} from "../utils/constants.js";

const todoSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    status: {
        type: String,
        enum: AvailableTodoStatuses,
        default: TodoStatusEnum.PENDING,
    },
    priority: {
        type: String,
        enum: AvailableTodoPriorities,
        default: TodoPriorityEnum.LOW,
    },
    dueDate: {
        type: Date,
    },
    tags: {
        type: [String],
        default: [],
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    deletedAt: {
        type: Date,
        default: null,
    }

}, {timestamps: true});

export const Todo = mongoose.model("Todo", todoSchema);

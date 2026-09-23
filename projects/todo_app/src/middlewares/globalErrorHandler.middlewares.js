import {ApiError} from "../utils/api-errors.js";
import { ApiResponse } from "../utils/api-response.js";

export const globalErrorHandler = (error, req, res, next) => {

    if(!(error instanceof ApiError)) {
        return res.status(500).json(new ApiResponse(500, error.message ?? "Internal server error", null))
    }

    return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, error.message, error.errors));
}

export {globalErrorHandler};
import { Router } from "express";
import { healthCheckRoute, refreshToken, userLogin, userLogout, userRegister, userVerification } from "../controllers/user.controllers.js";
import {refreshTokenValidator, userLoginValidator, userRegisterationValidator, userVerificationValidator} from "../validators/user.validators.js";
import {validate} from "../middlewares/validator.middlewares.js";

const userRoute = Router();
console.log("hello");

userRoute.route("/").get(healthCheckRoute);
userRoute.route("/register").post(userRegisterationValidator(), validate ,userRegister);
userRoute.route("/verify-email/:token").get(userVerificationValidator(), validate ,userVerification);
userRoute.route("/login").post(userLoginValidator(), validate, userLogin);
userRoute.route("/refresh-token").get(refreshTokenValidator(), validate ,refreshToken);
userRoute.route("/logout").get(refreshTokenValidator(), validate, userLogout);

export {userRoute};
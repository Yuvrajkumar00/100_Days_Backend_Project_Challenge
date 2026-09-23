import { Router } from "express";
import { healthCheckRoute, userRegister } from "../controllers/user.controllers.js";
import {userRegisterationValidator} from "../validators/user.validators.js";
import {validate} from "../middlewares/validator.middlewares.js";

const userRoute = Router();
console.log("hello");

userRoute.route("/").get(healthCheckRoute);
userRoute.route("/register").post(userRegisterationValidator(), validate ,userRegister);

export {userRoute};
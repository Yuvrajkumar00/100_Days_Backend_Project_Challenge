import {Router} from "express";
import {loginVerification} from "../middlewares/authentication.middlewares.js";
import { createTodo, getAllTodos, getTodo } from "../controllers/task.controllers.js";
import { todoIdValidator, todoValidator } from "../validators/user.validators.js";
import {validate} from "../middlewares/validator.middlewares.js";

const todoRoute = Router();

todoRoute.route("/create").post(loginVerification, todoValidator(), validate, createTodo);
todoRoute.route("/todo/:id").get(loginVerification, todoIdValidator(), validate, getTodo);
todoRoute.route("/all-todos").get(loginVerification, getAllTodos);


export {todoRoute};
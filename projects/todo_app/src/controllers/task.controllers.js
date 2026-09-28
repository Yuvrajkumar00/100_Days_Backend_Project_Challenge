import { asyncHandler } from "../utils/async-handler.js";
import { Todo } from "../models/task.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-errors.js";

const createTodo = asyncHandler(async (req, res) => {
    // 1. get data from user
    const { title, description, status, priority, dueDate, tags } = req.body;
    console.log(title, description, status, priority, dueDate, tags);

    // 2. validate data using express-validator middleware

    // 3. create todo
    const todo = await Todo.create({
        title,
        description,
        status,
        priority,
        dueDate,
        tags,
        createdBy: req.user._id,
    });

    // send res
    res.status(201).json(new ApiResponse(201, "Todo created successfully!!", todo));
});

const getTodo = asyncHandler(async (req, res) => {
    // 1. get specific todo id from param
    const { id } = req.params;
    console.log("id", id);

    // 2. validate id using express-validator middleware

    // 3. get todo based on id
    const todo = await Todo.findOne({ _id: id, createdBy: req.user._id });

    // 4. return res if todo not found
    if(!todo) {
        return res.status(404).json(new ApiResponse(404, "Todo is not found"));
    }
    // 5. send res
    res.status(200).json(new ApiResponse(200, "Get todo successfully!!", todo));
})

const getAllTodos = asyncHandler(async (req, res) => {
    // 1. get all todos
    const allTodos = await Todo.find({ createdBy: req.user._id });
    console.log("allTodos", allTodos);

    // 3. res send
    res.status(200).json(new ApiResponse(200, "Get all todos", allTodos));
})

const updateTodo = asyncHandler(async (req, res) => {
    // 1. get todo id from params
    const {id} = req.params;

    // 2. validate id using express-validator middleware

    // 3. get data from body
    const {title} = req.body;

    // 4. return res if title not found
    if(!title) {
        return res.status(400).json(new ApiResponse(400, "All data is required"));
    }
})

const deleteTodo = asyncHandler(async (req, res) => {

})


export { createTodo, getTodo, getAllTodos, updateTodo, deleteTodo };
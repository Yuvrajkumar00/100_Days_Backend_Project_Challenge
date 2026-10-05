import { asyncHandler } from "../utils/async-handler.js";
import { Todo } from "../models/task.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-errors.js";
import { AvailableTodoStatuses, AvailableTodoPriorities } from "../utils/constants.js";

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
    const todo = await Todo.findOne({ _id: id, createdBy: req.user._id, isDeleted: false });

    // 4. return res if todo not found
    if (!todo) {
        return res.status(404).json(new ApiResponse(404, "Todo is not found"));
    }
    // 5. send res
    res.status(200).json(new ApiResponse(200, "Get todo successfully!!", todo));
})

const getAllTodos = asyncHandler(async (req, res) => {
    // get data from query
    const { page = 1, limit = 10, status, priority } = req.query;
    console.log("page", page, "limit", limit, "status", status);

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if (pageNumber < 1 || Number.isNaN(pageNumber)) {
        return res.status(400).json(new ApiResponse(400, "Page length should be at least 1 or greater"));
    }

    if (limitNumber > 10 || limitNumber <= 0 || Number.isNaN(limitNumber)) {
        return res.status(400).json(new ApiResponse(400, "Limit number should be maximum 10"));
    }

    const skip = (pageNumber - 1) * limitNumber;

    let filter = {
        createdBy: req.user._id,
        isDeleted: false,
    };

    if (status) {
        if (!AvailableTodoStatuses.includes(status)) {
            return res.status(400).json(new ApiResponse(400, "Invalid status"));
        }
        filter.status = status;
    }

    if (priority) {
        if (!AvailableTodoPriorities.includes(priority)) {
            return res.status(400).json(new ApiResponse(400, "Invalid priority"));
        }
        filter.priority = priority;
    }
    console.log("filter", filter);

    // 1. get all todos
    const allTodos = await Todo.find(filter)
        .skip(skip)
        .limit(limitNumber);
    console.log("allTodos", allTodos);

    const totalTodos = await Todo.countDocuments(filter);
    const totalPages = Math.ceil(totalTodos / limitNumber);


    // 3. res send
    res.status(200).json(new ApiResponse(
        200,
        "Get all todos",
        {
            allTodos,
            pagination: {
                currentPage: pageNumber,
                limit: limitNumber,
                totalPages,
                totalTodos,
            }
        }
    ));
})

const updateTodo = asyncHandler(async (req, res) => {
    // 1. get todo id from params
    const { id } = req.params;

    // 2. validate id using express-validator middleware

    // 3. get data from body
    const { title, description, status, priority, dueDate, tags } = req.body;

    // 4. return res if title not found
    if (!title && !description && !status && !priority && !dueDate && !tags) {
        return res.status(400).json(new ApiResponse(400, "At least one data is required"));
    }

    const data = {
        title,
        description,
        status,
        priority,
        dueDate,
        tags,
    }
    const updateData = Object.fromEntries(
        Object.entries(data).filter(([keys, values]) => values !== undefined)
    )

    // 5. find todo based on id and update it
    const todo = await Todo.findOneAndUpdate({
        _id: id,
        createdBy: req.user._id,
        isDeleted: false,
    },
        updateData,
        { returnDocument: "after" }
    )

    // 6. return res if todo not found
    if (!todo) {
        return res.status(404).json(new ApiResponse(404, "Todo not found"));
    }

    // 7. send res
    res.status(200).json(new ApiResponse(200, "Todo updated successfully!!", todo));

})

const deleteTodo = asyncHandler(async (req, res) => {
    // 1. get id from the user 
    const { id } = req.params;

    // 2. validate id using express-validator

    // 3. find todo based on todo id and createdBy
    const todo = await Todo.findOne({ _id: id, createdBy: req.user._id });

    // 4. return res if todo not found
    if (!todo) {
        return res.status(404).json(new ApiResponse(404, "todo not found"));
    }

    // 5. update isDeleted = true and deletedAt = new Date()
    todo.isDeleted = true;
    todo.deletedAt = new Date();

    // 6. save todo
    await todo.save();

    // 7. send res and inside that res send this todo
    res.status(200).json(new ApiResponse(200, "Todo deleted Successfully!", todo));
})


export { createTodo, getTodo, getAllTodos, updateTodo, deleteTodo };
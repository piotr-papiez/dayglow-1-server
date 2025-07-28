// Libraries
import { Types } from "mongoose";
import xss from "xss";

// Utils
import decodeToken from "../utils/decode-token.util.js";
import { taskValidator } from "../validators/task.validator.js";

// Models
import Task from "../models/task.model.js";
import User from "../models/user.model.js";

// DELETE: /api/remove-task
export const removeTask = async (req, res) => {
    const userId = decodeToken(req.cookies.token);
    console.log(req.body);

    if (!userId) return res.status(401).json({ error: "Missing or invalid token" });

    const { taskId } = req.body;

    try {
        const task = await Task.findById(taskId);

        if (!task) return res.status(404).json({ error: "Task not found" });

        if (userId.toString() !== task.userId.toString()) return res.status(403).json({ error: "Access denied" });

        await task.deleteOne();

        res.status(200).json({ message: "Task removed" });
    } catch (error) {
        res.status(500).json({ error: "Server error while removing task" });
    }
}

// GET: /api/tasks
export const loadTasks = async (req, res) => {
    const userId = decodeToken(req.cookies.token);
    
    // console.log(userId);

    if (!userId) return res.status(401).json({ error: "Missing or invalid token" });

    try {
        const tasks = await Task.find({ userId: new Types.ObjectId(userId) });
        const { name } = await User.findById(userId, "name");

        res.status(200).json({ tasks, name });
    } catch (error) {
        res.status(500).json({ error: "Server error while loading tasks" });
    }
}

// POST: /api/create-task
export const createTask = async (req, res) => {
    const userId = decodeToken(req.cookies.token);

    if (!userId) return res.status(401).json({ error: "Missing or invalid token" });

    const validatedData = taskValidator.safeParse(req.body);

    if (!validatedData.success) return res.status(400).json({ error: "Validation error — invalid task data" });

    let { title, description } = validatedData.data;

    title = xss(title);
    description = xss(description);

    try {
        const taskExists = await Task.findOne({ title, userId });

        if (taskExists) return res.status(409).json({ error: "Task already exists" });

        await Task.create({
            title,
            userId,
            ...(description?.length > 0 && { description })
        });

        res.status(201).json({ message: "Task successfully created" });
    } catch {
        res.status(500).json({ error: "Server error while creating new task" });
    }
}
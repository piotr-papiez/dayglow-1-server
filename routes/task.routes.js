import { Router } from "express";

import { createTask, loadTasks, removeTask } from "../controllers/task.controller.js";

const router = Router();

router.delete("/remove-task", removeTask);

router.get("/tasks", loadTasks);

router.post("/create-task", createTask);

export default router;
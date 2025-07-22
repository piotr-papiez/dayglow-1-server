import { Router } from "express";

import { register, login, deleteAccount } from "../controllers/auth.controller.js";

const router = Router();

router.delete("/delete-account", deleteAccount);

router.post("/register", register);
router.post("/login", login);

export default router;
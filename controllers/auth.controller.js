// Libraries
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import xss from "xss";

// Utils
import decodeToken from "../utils/decode-token.util.js";
import { registerValidator, loginValidator } from "../validators/auth.validator.js";

// Models
import User from "../models/user.model.js";
import Task from "../models/task.model.js";

// POST: /api/register
export const register = async (req, res) => {
    const validatedData = registerValidator.safeParse(req.body);

    if (!validatedData.success) return res.status(400).json({ error: "Validation error — invalid user data" });

    let { name, mail, password } = validatedData.data;

    name = xss(name);

    try {
        const invalidPassword = !password.trim();
        const userExists = await User.findOne({ mail });
        
        if (userExists) return res.status(409).json({ error: "User exists" });
        if (invalidPassword) return res.status(400).json({ error: "Invalid password" });

        const encryptedPassword = await bcrypt.hash(password, 12);

        await User.create({ name, mail, password: encryptedPassword });

        res.status(201).json({ message: "User successfully registered" });
    } catch (error) {
        res.status(500).json({ error });
    }
}

// POST: /api/login
export const login = async (req, res) => {
    const validatedData = loginValidator.safeParse(req.body);

    if (!validatedData.success) return res.status(400).json({ error: "Validation error — invalid user data" });

    const { mail, password } = validatedData.data;

    try {
        const user = await User.findOne({ mail });

        if (!user) return res.status(401).json({ error: "User not found" });

        const isPasswordVerified = await bcrypt.compare(password, user.password);

        if (!isPasswordVerified) return res.status(401).json({ error: "Wrong password" });

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            domain: ".onrender.com",
            path: "/"
        });

        res.status(200).json({ message: "User successfully logged in" });
    } catch {
        res.status(500).json({ error: "Server error while logging in" });
    }
}

// DELETE: /api/delete-account
export const deleteAccount = async (req, res) => {
    const userId = decodeToken(req.cookies.token);

    if (!userId) return res.status(401).json({ error: "Missing or invalid token" });

    const { password } = req.body;

    try {
        const user = await User.findById(userId);

        if (!user) return res.status(401).json({ error: "User not found" });

        const isPasswordVerified = await bcrypt.compare(password, user.password);

        if (!isPasswordVerified) return res.status(401).json({ error: "Wrong password" });

        await Task.deleteMany({ userId: new Types.ObjectId(userId) });

        await user.deleteOne();

        res.sendStatus(204);
    } catch {
        res.status(500).json({ error: "Server error while deleting account" });
    }
}
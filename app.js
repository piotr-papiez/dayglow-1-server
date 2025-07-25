// Libraries
import "dotenv/config.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";

// Routes
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "https://dayglow-1.onrender.com",
    credentials: true
}));

app.use("/api", authRoutes);
app.use("/api", taskRoutes);

// Start server
async function startServer() {
    try {
        await mongoose.connect(MONGODB_URI);
        app.listen(PORT);
    } catch (error) {
        console.error(`Server error while connecting to the database: ${error}`);
    }
}

startServer();
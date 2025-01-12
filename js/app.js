import express from "express";
import cors from "cors";
import { User } from "./class/user.js";
import { Tasks } from "./class/task.js";
const app = express();
const userService = new User();
const taskService = new Tasks();
const allowedOrigins = ["http://localhost:5001", "http://127.0.0.1:5501"];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
}));
// Middleware to parse JSON requests
app.use(express.json());
/** User Routes **/
// User registration
app.post("/api/users/register", async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body;
        const userId = await userService.registerUser({ firstname, lastname, email, password });
        res.status(201).json({ message: "User registered successfully", userId });
    }
    catch (error) {
        res.status(500).json({ message: error.message || "An error occurred" });
    }
});
// User login
app.post("/api/users/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const { token, userId } = await userService.loginUser({ email, password });
        res.status(200).json({ message: "Login successful", token, userId });
    }
    catch (error) {
        res.status(401).json({ message: error.message || "Invalid credentials" });
    }
});
/** Task Routes **/
// Add a task
app.post("/api/tasks", async (req, res) => {
    try {
        const { title, description, deadline, userId } = req.body;
        const task = await taskService.addTask({ title, description, deadline, status: "pending", user_id: userId });
        res.status(201).json({ message: "Task created successfully", task });
    }
    catch (error) {
        res.status(500).json({ message: error.message || "An error occurred" });
    }
});
// Get tasks for a user
app.get("/api/tasks/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const tasks = await taskService.getTasks(Number(userId));
        res.status(200).json(tasks);
    }
    catch (error) {
        res.status(500).json({ message: error.message || "An error occurred" });
    }
});
// Mark task as completed
app.patch("/api/tasks/:taskId/complete", async (req, res) => {
    try {
        const { taskId } = req.params;
        const task = await taskService.markTaskAsCompleted(Number(taskId));
        res.status(200).json({ message: "Task marked as completed", task });
    }
    catch (error) {
        res.status(500).json({ message: error.message || "An error occurred" });
    }
});
// Delete a task
app.delete("/api/tasks/:taskId", async (req, res) => {
    try {
        const { taskId } = req.params;
        const task = await taskService.removeTask(Number(taskId));
        res.status(200).json({ message: "Task deleted successfully", task });
    }
    catch (error) {
        res.status(500).json({ message: error.message || "An error occurred" });
    }
});
// Start the server
app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});

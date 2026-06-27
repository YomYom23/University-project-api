import express from "express"
import { config } from "dotenv"
import { connectDB, disconnectDB } from "./config/db.js"
import cors from "cors"

import authRoutes from "./auth/authRoute.ts"; "../routes/authRoute.ts"

config()
connectDB()

const app = express()

// Middleware
app.use(express.json())
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}))
app.use(express.urlencoded({ extended: true }))

// Routes
app.use("/auth", authRoutes)

const server = app.listen(3000)

// Handle unhandled promise rejections (e.g., database connection errors)
process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err);
    server.close(async () => {
        await disconnectDB();
        process.exit(1);
    });
});

// Handle uncaught exceptions
process.on("uncaughtException", async (err) => {
    console.error("Uncaught Exception:", err);
    await disconnectDB();
    process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
    console.log("SIGTERM received, shutting down gracefully");
    server.close(async () => {
        await disconnectDB();
        process.exit(0);
    });
});
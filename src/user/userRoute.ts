import express from "express";
import { getCurrentUser, updateUser } from "./userControllers.ts";
import { authMiddleware } from "../auth/authMiddleware.ts";

const router = express.Router()

router.get("/me", authMiddleware, getCurrentUser)
router.patch("/", authMiddleware, updateUser)

export default router

import express from "express";
import { updateUser } from "./userControllers.ts";
import { authMiddleware } from "../auth/authMiddleware.ts";

const router = express.Router()

router.put("/:id", authMiddleware, updateUser)

export default router
import express from "express";
import { updateUser } from "./userControllers.ts";
import { authMiddleware } from "../auth/authMiddleware.ts";

const router = express.Router()

router.patch("/", authMiddleware, updateUser)

export default router
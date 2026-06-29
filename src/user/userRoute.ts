import express from "express";
import { updateUser } from "./userControllers.ts";
import { authMiddleware } from "../auth/authMiddleware.ts";

const router = express.Router()

router.put("/:userId", )
router.put("/:userId/:field/:value", authMiddleware, updateUser)

export default router
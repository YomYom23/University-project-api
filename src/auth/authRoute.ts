import express from "express";
import { registration, login, logout, checkAuthStatus } from "./authControllers.ts";
import { authMiddleware } from "./authMiddleware.ts";

const router = express.Router();

router.post("/registration", registration);
router.post("/login", login);
router.post("/logout", logout);
router.get("/status", authMiddleware, checkAuthStatus);

export default router;
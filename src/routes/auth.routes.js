
import { Router } from "express";
import { signup, login, getMe } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/api/auth/signup", signup);
router.post("/api/auth/login", login);
router.get("/api/auth/me", authMiddleware, getMe);

export default router;
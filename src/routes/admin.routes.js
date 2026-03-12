import { Router } from "express";
import {
  adminLogin,
  getUsers,
  updateUser,
  deleteUser,
} from "../controllers/admin.controller.js";

const router = Router();

router.post("/api/admin/login", adminLogin);
router.get("/api/admin/users", getUsers);
router.patch("/api/admin/users/:id", updateUser);
router.delete("/api/admin/users/:id", deleteUser);

export default router;
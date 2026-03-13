import jwt from "jsonwebtoken";
import 'dotenv/config';
import argon2 from "argon2";
import { z } from "zod";
import { prisma } from "../lib/db.js";
import { getAllUsers, deleteUserById, updateUserInfo } 
from "../services/admin.service.js"; 



const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
});



export const adminLogin = async (req, res) => {
  try {
    const { email, password } = adminLoginSchema.parse(req.body);

    const admin = await prisma.admin.findUnique({ where: { email } });

    if (!admin) {
      return res.status(401).json({ error: "Access denied. Admin only." });
    }

    const isValid = await argon2.verify(admin.password, password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not set in environment variables");
      return res.status(500).json({ error: "Server misconfiguration" });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({ message: "Logged in successfully", token });

  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Admin Login Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    
    const result = await getAllUsers(page, limit);

    res.json(result);
  } catch (error) {
    console.error("Get Users Error:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    
    await deleteUserById(id);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({ error: "Could not delete user" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    
    const data = updateUserSchema.parse(req.body);

    const updated = await updateUserInfo(id, data);

    res.json(updated);
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Update User Error:", error);
    res.status(500).json({ error: "Update failed" });
  }
};
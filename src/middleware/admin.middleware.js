import 'dotenv/config';
import jwt from "jsonwebtoken";
import { prisma } from "../lib/db.js";

const JWT_SECRET = process.env.JWT_SECRET;

// Guard: fail fast if JWT_SECRET is missing at startup
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not set in environment variables. Check your .env file.");
}

export const adminMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: Missing or malformed token" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token — throws if expired or signature mismatch
    const decoded = jwt.verify(token, JWT_SECRET);

    // Confirm admin still exists in the database
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.id },
    });

    if (!admin) {
      return res.status(403).json({ message: "Forbidden: Admin not found" });
    }

    req.user = admin; // attach full admin object to request
    next();

  } catch (error) {
    console.error("Admin Middleware Error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
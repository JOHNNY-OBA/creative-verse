
import * as authService from "../services/auth.service.js";
import { signupSchema, loginSchema } from "../auth.validation.js"; 
export const signup = async (req, res) => {
  try {
    
    const validatedData = signupSchema.parse(req.body);

    
    const user = await authService.signup(validatedData);
    
    res.status(201).json(user);
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ error: error.errors });
    }
    
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    
    const validatedData = loginSchema.parse(req.body);

    
    const token = await authService.login(validatedData);
    
    res.json({ token });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ error: error.errors });
    }
    
    res.status(401).json({ error: error.message || "Invalid credentials" });
  }
};

export const getMe = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  res.json(req.user);
};
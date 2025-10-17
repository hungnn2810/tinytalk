import express from "express";
import { prisma } from "../../prisma/prisma";
import {
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  hashPassword,
  verifyRefreshToken,
} from "../utils/auth";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(400).json({ message: "Email exists" });

  const hashed = await hashPassword(password);
  const user = await prisma.user.create({
    data: { email, password: hashed, role },
  });

  res.json({ id: user.id, email: user.email, role: user.role });
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user)
    return res.status(400).json({ message: "Invalid email or password" });

  const match = await comparePassword(password, user.password);
  if (!match)
    return res.status(400).json({ message: "Invalid email or password" });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return res.json({
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  });
});

// Refresh token
router.post("/refresh", async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const payload = verifyRefreshToken(token) as any;
    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const accessToken = generateAccessToken(user);
    res.json({ accessToken });
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
});

export default router;

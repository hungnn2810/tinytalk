import type { NextFunction, Request, Response } from "express";
import express from "express";
import { prisma } from "../../prisma/prisma";
import { validateRequest } from "../middlewares/validateRequest";
import {
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  hashPassword,
  verifyRefreshToken,
} from "../utils/auth";
import {
  loginValidator,
  refreshTokenValidator,
  registerValidator,
} from "../validators/auth.validator";

const router = express.Router();

// Register
router.post(
  "/register",
  registerValidator,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      validateRequest(req);
      const { email, password, name, role } = req.body;

      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) return res.status(400).json({ message: "Email exists" });

      const hashed = await hashPassword(password);
      const user = await prisma.user.create({
        data: { email, password: hashed, name, role },
      });

      res.json({ id: user.id, email: user.email, role: user.role });
    } catch (err) {
      next(err);
    }
  }
);

// Login
router.post(
  "/login",
  loginValidator,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      validateRequest(req);
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
          name: user.name,
          role: user.role,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

// Refresh token
router.post(
  "/refresh",
  refreshTokenValidator,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      validateRequest(req);
      const { token } = req.body;

      try {
        const payload = verifyRefreshToken(token) as any;
        const user = await prisma.user.findUnique({
          where: { id: payload.id },
        });
        if (!user) return res.status(404).json({ message: "User not found" });

        const accessToken = generateAccessToken(user);
        res.json({ accessToken });
      } catch {
        res.status(401).json({ message: "Invalid token" });
      }
    } catch (err) {
      next(err);
    }
  }
);

export default router;

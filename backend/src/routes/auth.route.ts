import type { NextFunction, Request, Response } from "express";
import express from "express";
import { validateRequest } from "../middlewares/validateRequest";
import { prisma } from "../prisma/prisma";
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
      const { username, password, name, role } = req.body;

      const existing = await prisma.user.findUnique({ where: { username } });
      if (existing)
        return res.status(400).json({ message: "User name exists" });

      const hashed = await hashPassword(password);
      const user = await prisma.user.create({
        data: { username, password: hashed, name, role },
      });

      res.json({ id: user.id, username: user.username, role: user.role });
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
      const { username, password } = req.body;
      const user = await prisma.user.findUnique({ where: { username } });
      if (!user)
        return res
          .status(400)
          .json({ message: "Invalid user name or password" });

      const match = await comparePassword(password, user.password);
      if (!match)
        return res
          .status(400)
          .json({ message: "Invalid user name or password" });

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      return res.json({
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          username: user.username,
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

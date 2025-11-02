import { Role } from "@prisma/client";
import express, { NextFunction, Request, Response } from "express";
import { authenticate, authorize } from "../middlewares/auth";
import { validateRequest } from "../middlewares/validateRequest";
import { prisma } from "../prisma/prisma";
import { libraryCreateValidator } from "../validators/library.validator";

const router = express.Router();

// Create
router.post(
  "/",
  authenticate,
  authorize(Role.ADMIN, Role.TEACHER),
  libraryCreateValidator,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      validateRequest(req);
      const { name } = req.body;

      const existing = await prisma.library.findFirst({
        where: { name },
      });

      if (existing) return res.status(400).json({ message: "Library exists" });

      const newEntity = await prisma.library.create({
        data: { name },
      });

      return res.status(201).json(newEntity);
    } catch (err) {
      next(err);
    }
  }
);

export default router;

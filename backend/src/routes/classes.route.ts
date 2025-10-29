import { Role } from "@prisma/client";
import express, { NextFunction, Request, Response } from "express";
import { authenticate, authorize } from "../middlewares/auth";
import { validateRequest } from "../middlewares/validateRequest";
import {
  createSearchResponseMetadata,
  SearchResponse,
} from "../models/pagination";
import { prisma } from "../prisma/prisma";
import { parseQuery } from "../utils/parseQuery";
import {
  createClassValidator,
  updateClassValidator,
} from "../validators/class.validator";

const router = express.Router();

// Create
router.post(
  "/",
  authenticate,
  authorize(Role.ADMIN, Role.TEACHER),
  createClassValidator,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      validateRequest(req);
      const { name, code, colorCode, startTime, endTime } = req.body;

      const existing = await prisma.class.findFirst({
        where: { OR: [{ code }, { name }] },
      });

      if (existing) return res.status(400).json({ message: "Class exists" });

      const newEntity = await prisma.class.create({
        data: { name, code, colorCode, startTime, endTime },
      });

      return res.status(201).json(newEntity);
    } catch (err) {
      next(err);
    }
  }
);

interface ClassQuery {
  page: number;
  limit: number;
  name?: string;
  code?: string;
}

// Search
router.get(
  "/",
  authenticate,
  authorize(Role.ADMIN, Role.TEACHER),
  async (req, res) => {
    const { page, limit, name, code } = parseQuery<ClassQuery>(req.query, {
      page: 1,
      limit: 10,
    });

    const skip = (Number(page) - 1) * Number(limit);
    const where: any = {};

    if (name) where.name = { contains: name, mode: "insensitive" };
    if (code) where.code = { contains: code, mode: "insensitive" };

    const [total, data] = await Promise.all([
      prisma.class.count({ where }),
      prisma.class.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const metadata = createSearchResponseMetadata(
      total,
      Number(page),
      Number(limit)
    );

    const result: SearchResponse<(typeof data)[0]> = {
      data,
      metadata,
    };

    res.json(result);
  }
);

// Get by id
router.get(
  "/:id",
  authenticate,
  authorize(Role.ADMIN, Role.TEACHER),
  async (req, res) => {
    const { id } = req.params;

    const entity = await prisma.class.findUnique({ where: { id } });
    if (!entity) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(entity);
  }
);

// Update
router.put(
  "/:id",
  authenticate,
  authorize(Role.ADMIN, Role.TEACHER),
  updateClassValidator,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      validateRequest(req);
      const { id } = req.params;
      const { name, code, colorCode, startTime, endTime } = req.body;

      const existing = await prisma.class.findFirst({
        where: {
          OR: [{ code }, { name }],
          NOT: { id },
        },
      });

      if (existing)
        return res.status(400).json({ message: "Class name or code exists" });

      const updated = await prisma.class.update({
        where: { id },
        data: { name, code, colorCode, startTime, endTime },
      });

      res.json(updated);
    } catch (err) {
      next(err);
    }
  }
);

export default router;

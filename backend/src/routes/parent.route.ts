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
import { createParentValidator } from "../validators/parent.validator";

const router = express.Router();

// Create
router.post(
  "/",
  authenticate,
  authorize(Role.ADMIN, Role.TEACHER),
  createParentValidator,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      validateRequest(req);
      const { name, phoneNumber, relationshipToStudent, address } = req.body;

      const existing = await prisma.parent.findFirst({
        where: { name, phoneNumber },
      });

      if (existing) return res.status(400).json({ message: "Parent exists" });

      const newEntity = await prisma.parent.create({
        data: { name, phoneNumber, relationshipToStudent, address },
      });

      return res.status(201).json(newEntity);
    } catch (err) {
      next(err);
    }
  }
);

interface ParentQuery {
  page: number;
  limit: number;
  keyword?: string;
}

// Search
router.get(
  "/",
  authenticate,
  authorize(Role.ADMIN, Role.TEACHER),
  async (req, res) => {
    const { page, limit, keyword } = parseQuery<ParentQuery>(req.query, {
      page: 1,
      limit: 10,
    });
    const skip = (Number(page) - 1) * Number(limit);
    const where: any = {};

    if (keyword) {
      where.OR = [{ name: { contains: keyword, mode: "insensitive" } }];
    }

    const [total, data] = await Promise.all([
      prisma.parent.count({ where }),
      prisma.parent.findMany({
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

export default router;

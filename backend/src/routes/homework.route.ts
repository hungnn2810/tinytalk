import { Role } from "@prisma/client";
import express from "express";
import { authenticate, authorize } from "../middlewares/auth";
import {
  createSearchResponseMetadata,
  SearchResponse,
} from "../models/pagination";
import { prisma } from "../prisma/prisma";
import { parseQuery } from "../utils/parseQuery";

const router = express.Router();

interface HomeworkQuery {
  page: number;
  limit: number;
  classId?: string;
}

// Search
router.get(
  "/",
  authenticate,
  authorize(Role.ADMIN, Role.TEACHER),
  async (req, res) => {
    const { page, limit, classId } = parseQuery<HomeworkQuery>(req.query, {
      page: 1,
      limit: 10,
    });

    const skip = (Number(page) - 1) * Number(limit);
    const where: any = {};

    if (classId) where.classId = classId;

    const [total, data] = await Promise.all([
      prisma.homework.count({ where }),
      prisma.homework.findMany({
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

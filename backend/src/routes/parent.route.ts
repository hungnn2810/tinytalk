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

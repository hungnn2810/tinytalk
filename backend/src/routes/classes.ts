import { Prisma } from "@prisma/client";
import express from "express";
import { prisma } from "../../prisma/prisma";
import {
  createSearchResponseMetadata,
  SearchParams,
  SearchResponse,
} from "../models/pagination";

const router = express.Router();

// Create
router.post("/", async (req, res) => {
  const { name, code } = req.body;

  if (!name || !code) {
    return res.status(400).json({ message: "Name and code are required" });
  }

  const existing = await prisma.class.findFirst({
    where: { OR: [{ code }, { name }] },
  });

  if (existing) return res.status(400).json({ message: "Class exists" });

  const newClass = await prisma.class.create({
    data: { name, code },
  });

  return res.status(201).json(newClass);
});

// Search
router.get("/", async (req, res) => {
  const { search = "", page = 1, limit = 10 } = req.query as SearchParams;
  const skip = (Number(page) - 1) * Number(limit);
  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
          { code: { contains: search, mode: Prisma.QueryMode.insensitive } },
        ],
      }
    : {};

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
});

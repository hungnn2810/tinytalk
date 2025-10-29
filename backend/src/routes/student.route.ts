import { Role } from "@prisma/client";
import express, { NextFunction, Request, Response } from "express";
import { prisma } from "../../prisma/prisma";
import { authenticate, authorize } from "../middlewares/auth";
import { validateRequest } from "../middlewares/validateRequest";
import {
  createSearchResponseMetadata,
  SearchResponse,
} from "../models/pagination";
import { hashPassword } from "../utils/auth";
import { parseQuery } from "../utils/parseQuery";
import { createStudentValidator } from "../validators/student.validator";

const router = express.Router();

// Create
router.post(
  "/",
  authenticate,
  authorize(Role.ADMIN, Role.TEACHER),
  createStudentValidator,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      validateRequest(req);
      const {
        name,
        classIds,
        gender,
        dateOfBirth,
        status,
        username,
        password,
        parentIds,
      } = req.body;

      const existing = await prisma.student.findFirst({
        where: { name },
      });

      if (existing) return res.status(400).json({ message: "Student exists" });

      const existingUser = await prisma.user.findUnique({
        where: { username },
      });

      if (existingUser)
        return res.status(400).json({ message: "User name exists" });

      if (classIds && classIds.length > 0) {
        const classes = await prisma.class.findMany({
          where: { id: { in: classIds } },
        });

        if (classes.length !== classIds.length) {
          return res
            .status(400)
            .json({ message: "One or more classes not found" });
        }
      }

      if (parentIds && parentIds.length > 0) {
        const parents = await prisma.parent.findMany({
          where: { id: { in: parentIds } },
        });

        if (parents.length !== parentIds.length) {
          return res
            .status(400)
            .json({ message: "One or more parents not found" });
        }
      }

      const hashed = await hashPassword(password);
      const user = await prisma.user.create({
        data: {
          username: username,
          password: hashed,
          name: name,
          role: "STUDENT",
        },
      });

      const entity = await prisma.student.create({
        data: {
          name,
          gender,
          dateOfBirth: new Date(dateOfBirth),
          status,
          user_id: user.id,
          ...(classIds &&
            classIds.length > 0 && {
              classes: {
                create: classIds.map((classId: string) => ({
                  class: { connect: { id: classId } },
                })),
              },
            }),
          parents: {
            create: parentIds.map((parentId: string) => ({
              parent: { connect: { id: parentId } },
            })),
          },
        },
        include: {
          user: true,
          classes: {
            include: {
              class: true,
            },
          },
          parents: {
            include: {
              parent: true,
            },
          },
        },
      });

      const transformed = {
        ...entity,
        classes: entity.classes.map((c) => c.class),
        parents: entity.parents.map((p) => p.parent),
      };

      res.json(transformed);
    } catch (err) {
      next(err);
    }
  }
);

interface StudentQuery {
  page: number;
  limit: number;
  name?: string;
}

// Search
router.get(
  "/",
  authenticate,
  authorize(Role.ADMIN, Role.TEACHER),
  async (req, res) => {
    const { page, limit, name } = parseQuery<StudentQuery>(req.query, {
      page: 1,
      limit: 10,
    });

    const skip = (Number(page) - 1) * Number(limit);
    const where: any = {};

    if (name) where.name = { contains: name, mode: "insensitive" };

    const [total, data] = await Promise.all([
      prisma.student.count({ where }),
      prisma.student.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: "desc" },
        include: {
          user: true,
          classes: {
            include: {
              class: true,
            },
          },
          parents: {
            include: {
              parent: true,
            },
          },
        },
      }),
    ]);

    const transformedData = data.map((student) => ({
      ...student,
      classes: student.classes.map((c) => c.class),
      parents: student.parents.map((p) => p.parent),
    }));

    const metadata = createSearchResponseMetadata(
      total,
      Number(page),
      Number(limit)
    );

    const result: SearchResponse<(typeof transformedData)[0]> = {
      data: transformedData,
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

    const entity = await prisma.student.findUnique({
      where: { id },
      include: {
        user: true,
        classes: {
          include: {
            class: true,
          },
        },
        parents: {
          include: {
            parent: true,
          },
        },
      },
    });
    if (!entity) {
      return res.status(404).json({ message: "Not found" });
    }

    const transformed = {
      ...entity,
      classes: entity.classes.map((c) => c.class),
      parents: entity.parents.map((p) => p.parent),
    };

    res.json(transformed);
  }
);

export default router;

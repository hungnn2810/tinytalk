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
  createStudentValidator,
  updateStudentValidator,
} from "../validators/student.validator";

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
      const { name, gender, dateOfBirth, status, classIds, parentId, parent } =
        req.body;

      const existing = await prisma.student.findFirst({
        where: { name },
      });

      if (existing) return res.status(400).json({ message: "Student exists" });

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

      let finalParentId = parentId;

      // If parent object is provided, create new parent with user account
      if (parent && parent.user) {
        // Check if user with phone number already exists
        const existingUser = await prisma.user.findUnique({
          where: { username: parent.user.username },
        });

        if (existingUser) {
          return res
            .status(400)
            .json({ message: "Phone number already registered" });
        }

        // Create user account
        const newUser = await prisma.user.create({
          data: {
            username: parent.user.username, // phoneNumber
            password: parent.user.password,
            name: parent.name,
            role: Role.PARENT,
          },
        });

        // Create parent record
        const newParent = await prisma.parent.create({
          data: {
            name: parent.name,
            phoneNumber: parent.phoneNumber,
            relationshipToStudent: parent.relationshipToStudent,
            address: parent.address,
            user_id: newUser.id,
          },
        });

        finalParentId = newParent.id;
      } else if (parentId) {
        // Verify existing parent
        const existingParent = await prisma.parent.findUnique({
          where: { id: parentId },
        });

        if (!existingParent) {
          return res.status(400).json({ message: "Parent not found" });
        }
      }

      const entity = await prisma.student.create({
        data: {
          name,
          gender,
          dateOfBirth: new Date(dateOfBirth),
          status,
          ...(classIds &&
            classIds.length > 0 && {
              classes: {
                create: classIds.map((classId: string) => ({
                  class: { connect: { id: classId } },
                })),
              },
            }),
          ...(finalParentId && { parentId: finalParentId }),
        },
        include: {
          parent: true,
          classes: {
            include: {
              class: true,
            },
          },
        },
      });

      const transformed = {
        ...entity,
        classes: entity.classes.map((c) => c.class),
      };

      res.json(transformed);
    } catch (err) {
      next(err);
    }
  }
);

// Update
router.put(
  "/:id",
  authenticate,
  authorize(Role.ADMIN, Role.TEACHER),
  updateStudentValidator,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      validateRequest(req);
      const { id } = req.params;
      const { name, gender, dateOfBirth, status, classIds } = req.body;

      const existing = await prisma.student.findUnique({
        where: { id },
      });

      if (!existing) {
        return res.status(404).json({ message: "Student not found" });
      }

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

      // Delete existing class associations
      await prisma.studentClassMap.deleteMany({
        where: { studentId: id },
      });

      const entity = await prisma.student.update({
        where: { id },
        data: {
          name,
          gender,
          dateOfBirth: new Date(dateOfBirth),
          status,
          ...(classIds &&
            classIds.length > 0 && {
              classes: {
                create: classIds.map((classId: string) => ({
                  class: { connect: { id: classId } },
                })),
              },
            }),
        },
        include: {
          parent: true,
          classes: {
            include: {
              class: true,
            },
          },
        },
      });

      const transformed = {
        ...entity,
        classes: entity.classes.map((c) => c.class),
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
          parent: true,
          classes: {
            include: {
              class: true,
            },
          },
        },
      }),
    ]);

    const transformedData = data.map((student) => ({
      ...student,
      classes: student.classes.map((c) => c.class),
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
        parent: true,
        classes: {
          include: {
            class: true,
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
    };

    res.json(transformed);
  }
);

export default router;

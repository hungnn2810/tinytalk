import express, { NextFunction, Request, Response } from "express";
import { prisma } from "../../prisma/prisma";
import { validateRequest } from "../middlewares/validateRequest";
import { hashPassword } from "../utils/auth";
import { createStudentValidator } from "../validators/student.validator";

const router = express.Router();

// Create
router.post(
  "/",
  createStudentValidator,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      validateRequest(req);
      const { name, gender, dateOfBirth, status, email, password, parents } =
        req.body;

      const existing = await prisma.student.findFirst({
        where: { name },
      });

      if (existing) return res.status(400).json({ message: "Student exists" });

      const hashed = await hashPassword(password);
      const user = await prisma.user.create({
        data: {
          email,
          password: hashed,
          name: name,
          role: "STUDENT",
        },
      });

      const student = await prisma.student.create({
        data: {
          name,
          gender,
          dateOfBirth: new Date(dateOfBirth),
          status,
          user_id: user.id,
          parents: {
            create: parents.map((p: any) => ({
              parent: {
                create: {
                  name: p.name,
                  phoneNumber: p.phoneNumber,
                  relationshipToStudent: p.relationshipToStudent,
                },
              },
            })),
          },
        },
        include: {
          user: true,
          parents: {
            include: {
              parent: true,
            },
          },
        },
      });
      return res.status(201).json(student);
    } catch (err) {
      next(err);
    }
  }
);

export default router;

import { $Enums } from "@prisma/client";
import { body } from "express-validator";

export const createStudentValidator = [
  body("name").notEmpty().withMessage("First name is required"),
  body("gender")
    .notEmpty()
    .withMessage("Gender is required")
    .isIn([$Enums.Gender.MALE, $Enums.Gender.FEMALE])
    .withMessage(
      `Role must be one of: ${Object.values($Enums.Gender).join(", ")}`
    ),

  body("dateOfBirth")
    .notEmpty()
    .withMessage("Date of birth is required")
    .isISO8601()
    .withMessage("Start time must be a valid ISO 8601 date"),

  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn([
      $Enums.StudentStatus.PENDING,
      $Enums.StudentStatus.INPROGRESS,
      $Enums.StudentStatus.COMPLETED,
    ])
    .withMessage(
      `Status must be one of: ${Object.values($Enums.StudentStatus).join(", ")}`
    ),

  body("classIds")
    .optional({ nullable: true })
    .isArray()
    .withMessage("Class ids must be an array"),
];

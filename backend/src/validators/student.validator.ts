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
    .isDate({ format: "YYYY-MM-DD" })
    .withMessage("Date of birth must be in format YYYY-MM-DD"),

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

  body("userId").notEmpty().withMessage("User id is required"),

  body("parentIds").isArray().withMessage("Parent ids must be an array"),
];

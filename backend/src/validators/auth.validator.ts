import { $Enums } from "@prisma/client";
import { body } from "express-validator";

export const registerValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is incorrect format"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must have at least 6 characters"),

  body("name").notEmpty().withMessage("Name is required"),

  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn([$Enums.Role.ADMIN, $Enums.Role.TEACHER, $Enums.Role.STUDENT])
    .withMessage(
      `Role must be one of: ${Object.values($Enums.Role).join(", ")}`
    ),
];

export const loginValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is incorrect format"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must have at least 6 characters"),
];

export const refreshTokenValidator = [
  body("token").notEmpty().withMessage("Refresh token is required"),
];

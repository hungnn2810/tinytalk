import { $Enums } from "@prisma/client";
import { body } from "express-validator";

export const registerValidator = [
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .matches(/^(0|\+84)(3|5|7|8|9)[0-9]{8}$/)
    .withMessage("Username must be a valid Vietnamese phone number"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must have at least 6 characters"),

  body("name").notEmpty().withMessage("Name is required"),

  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn([$Enums.Role.ADMIN, $Enums.Role.TEACHER, $Enums.Role.PARENT])
    .withMessage(
      `Role must be one of: ${Object.values($Enums.Role).join(", ")}`
    ),
];

export const loginValidator = [
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .matches(/^(0|\+84)(3|5|7|8|9)[0-9]{8}$/)
    .withMessage("Username must be a valid Vietnamese phone number"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must have at least 6 characters"),
];

export const refreshTokenValidator = [
  body("token").notEmpty().withMessage("Refresh token is required"),
];

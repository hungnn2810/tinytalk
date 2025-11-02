import { body } from "express-validator";

export const libraryCreateValidator = [
  body("name").notEmpty().withMessage("Name is required"),
];

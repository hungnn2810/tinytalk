import { body } from "express-validator";

export const createClassValidator = [
  body("name").notEmpty().withMessage("Class name is required"),
  body("code").notEmpty().withMessage("Class code is required"),
  body("colorCode").notEmpty().withMessage("Class color code is required"),
  body("startTime")
    .isISO8601()
    .withMessage("Start time must be a valid ISO 8601 date"),
  body("endTime")
    .optional({ nullable: true })
    .custom((value) => {
      if (value === null) return true;
      return !isNaN(Date.parse(value));
    })
    .withMessage("End time must be a valid ISO 8601 date"),
];

export const updateClassValidator = createClassValidator;

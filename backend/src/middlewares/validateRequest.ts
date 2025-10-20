import type { Request } from "express";
import { FieldValidationError, validationResult } from "express-validator";
import { ValidationException } from "../exceptions/validation.exception";

export const validateRequest = (req: Request) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return;

  const formatted = errors
    .array()
    .filter((err): err is FieldValidationError => err.type === "field")
    .map((err) => ({
      field: err.path,
      message: err.msg,
      value: err.value,
    }));

  throw new ValidationException(formatted);
};

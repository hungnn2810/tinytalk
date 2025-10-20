import type { NextFunction, Request, Response } from "express";
import { ValidationException } from "../exceptions/validation.exception";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ValidationException) {
    return res.status(400).json({
      message: err.message,
      errors: err.errors,
    });
  }

  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
};

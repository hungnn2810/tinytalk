import { ValidationError as ExpressValidationError } from "express-validator";

export class ValidationError {
  path?: string;
  value?: any;
  msg: string;
  location?: string;

  constructor(error: ExpressValidationError) {
    if ("path" in error) {
      this.path = error.path;
      this.value = (error as any).value;
      this.location = error.location;
    }

    this.msg = error.msg;
  }
}

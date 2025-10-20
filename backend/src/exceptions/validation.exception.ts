export class ValidationException extends Error {
  public errors: { field: string; message: string; value?: any }[];

  constructor(errors: { field: string; message: string; value?: any }[]) {
    super("Validation failed");
    this.name = "ValidationException";
    this.errors = errors;
  }
}

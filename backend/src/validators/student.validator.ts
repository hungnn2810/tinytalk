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
    .withMessage("Date of birth must be a valid ISO 8601 date"),
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

  body("parents").custom((parents) => {
    if (!Array.isArray(parents)) throw new Error("Parents must be an array");

    if (parents.length > 1) {
      for (const p of parents) {
        if (!p.name) throw new Error("Parent name is required");
        if (!p.phoneNumber) throw new Error("Parent phone number is required");
        if (!p.relationshipToStudent)
          throw new Error("Relationship to student is required");
        if (
          p.relationshipToStudent &&
          !Object.values($Enums.RelationshipToStudent).includes(
            p.relationshipToStudent
          )
        )
          throw new Error(
            `Relationship to student must be one of: ${Object.values(
              $Enums.RelationshipToStudent
            ).join(", ")}`
          );
      }
    }
    return true;
  }),
];

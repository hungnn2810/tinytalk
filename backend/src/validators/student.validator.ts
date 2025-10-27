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
    .withMessage("classIds must be an array"),

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

import { $Enums } from "@prisma/client";
import { body } from "express-validator";

export const createParentValidator = [
  body("name").notEmpty().withMessage("Parent name is required"),
  body("phoneNumber")
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^(0|\+84)(3|5|7|8|9)[0-9]{8}$/)
    .withMessage("Phone number must be a valid Vietnamese phone number"),
  body("relationshipToStudent")
    .notEmpty()
    .withMessage("Relationship to student is required")
    .isIn([
      $Enums.RelationshipToStudent.FATHER,
      $Enums.RelationshipToStudent.MOTHER,
      $Enums.RelationshipToStudent.SISTER,
      $Enums.RelationshipToStudent.BROTHER,
      $Enums.RelationshipToStudent.GRANDFATHER,
      $Enums.RelationshipToStudent.GRANDMOTHER,
    ])
    .withMessage(
      `Relationship to student must be one of: ${Object.values(
        $Enums.RelationshipToStudent
      ).join(", ")}`
    ),
];

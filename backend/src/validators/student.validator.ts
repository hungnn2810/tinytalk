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
    .withMessage("Start time must be a valid ISO 8601 date"),

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
    .withMessage("Class ids must be an array"),

  body("parentId")
    .optional({ nullable: true })
    .isString()
    .withMessage("Parent ID must be a string"),

  // Optional parent object for creating new parent
  body("parent")
    .optional({ nullable: true })
    .isObject()
    .withMessage("Parent must be an object"),

  body("parent.name")
    .optional()
    .notEmpty()
    .withMessage("Parent name is required when creating new parent"),

  body("parent.phoneNumber")
    .optional()
    .matches(/^(0|\+84)(3|5|7|8|9)[0-9]{8}$/)
    .withMessage("Phone number must be a valid Vietnamese phone number"),

  body("parent.relationshipToStudent")
    .optional()
    .isIn([
      $Enums.RelationshipToStudent.FATHER,
      $Enums.RelationshipToStudent.MOTHER,
    ])
    .withMessage(
      `Relationship must be one of: ${Object.values(
        $Enums.RelationshipToStudent
      ).join(", ")}`
    ),

  body("parent.address")
    .optional()
    .notEmpty()
    .withMessage("Address is required when creating new parent"),

  body("parent.user")
    .optional()
    .isObject()
    .withMessage("User must be an object"),

  body("parent.user.username")
    .optional()
    .notEmpty()
    .withMessage("Username is required when creating new parent"),

  body("parent.user.password")
    .optional()
    .notEmpty()
    .withMessage("Password is required when creating new parent"),
];

export const updateStudentValidator = [
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
    .withMessage("Start time must be a valid ISO 8601 date"),

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
    .withMessage("Class ids must be an array"),
];

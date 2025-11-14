import type { Gender } from "../enums/Gender";
import type { StudentStatus } from "../enums/StudentStatus";
import type { Class } from "./class.model";
import type { Parent } from "./parent.model";

export interface Student {
  id: string;
  name: string;
  gender: Gender;
  dateOfBirth: Date;
  status: StudentStatus;
  classes: Class[];
  parent: Parent;
}

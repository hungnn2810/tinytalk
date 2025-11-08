import type { Gender } from "../enums/Gender";
import type { Class } from "./class.model";
import type { Parent } from "./parent.model";

export interface Student {
  id: string;
  name: string;
  gender: Gender;
  dateOfBirth: Date;
  classes: Class[];
  parent: Parent;
}

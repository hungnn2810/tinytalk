import type { Gender } from "../enums/gender";
import type { Class } from "./class.model";

export interface Student {
  id: string;
  name: string;
  gender: Gender;
  dateOfBirth: Date;
  classes: Class[];
}

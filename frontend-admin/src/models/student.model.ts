import type { Gender } from "../enums/gender";

export interface Student {
  id: string;
  name: string;
  gender: Gender;
  dateOfBirth: Date;
  classId: string;
}

import type { Student } from "./student.model";

export interface Class {
  id: string;
  name: string;
  code: string;
  colorCode: string;
  startTime: string;
  endTime?: string;
  students: Student[];
}

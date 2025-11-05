import type { HomeworkType } from "../enums/HomeworkType";

export interface Homework {
  id: string;
  name: string;
  type: HomeworkType;
  description: string;
  content: string;
}

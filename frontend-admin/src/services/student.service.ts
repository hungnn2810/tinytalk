import { ApiMethod } from "../enums/apiMethod";
import type { SearchParams, SearchResponse } from "../models/base/search.model";
import type { Student } from "../models/student.model";
import { apiRequest } from "../utils/api.util";

export interface SearchStudentRequest extends SearchParams {
  name?: string;
  classId?: string;
}

export async function searchStudent(
  params: SearchStudentRequest
): Promise<SearchResponse<Student>> {
  const res = await apiRequest<SearchResponse<Student>>(
    ApiMethod.GET,
    "/students",
    params
  );
  return res;
}

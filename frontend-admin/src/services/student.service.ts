import { ApiMethod } from "../enums/ApiMethod";
import type { Gender } from "../enums/Gender";
import type { SearchParams, SearchResponse } from "../models/base/search.model";
import type { Student } from "../models/student.model";
import { apiRequest } from "../utils/api.util";

export interface SearchStudentRequest extends SearchParams {
  name?: string;
  classId?: string;
}

export interface CreateStudentRequest {
  name: string;
  gender: Gender;
  dateOfBirth: Date;
  status: string;
  classIds: string[];
  parentId: string;
  userId: string;
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

export async function createStudent(
  params: CreateStudentRequest
): Promise<Student> {
  const res = await apiRequest<Student>(ApiMethod.POST, "/students", params);
  return res;
}

export async function getStudentById(id: string): Promise<Student> {
  const res = await apiRequest<Student>(ApiMethod.GET, `/students/${id}`);
  return res;
}

export interface UpdateStudentRequest {
  name: string;
  gender: Gender;
  dateOfBirth: Date;
  status: string;
  classIds: string[];
}

export async function updateStudent(
  id: string,
  params: UpdateStudentRequest
): Promise<Student> {
  const res = await apiRequest<Student>(
    ApiMethod.PUT,
    `/students/${id}`,
    params
  );
  return res;
}

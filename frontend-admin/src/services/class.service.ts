import { ApiMethod } from "../enums/ApiMethod";
import type { SearchParams, SearchResponse } from "../models/base/search.model";
import type { Class } from "../models/class.model";
import { apiRequest } from "../utils/api.util";

export interface SearchClassRequest extends SearchParams {
  keyword?: string;
}

export interface CreateClassRequest {
  name: string;
  code: string;
  colorCode: string;
  startTime: Date;
  endTime?: Date | null;
}

export async function searchClass(
  params: SearchClassRequest
): Promise<SearchResponse<Class>> {
  const res = await apiRequest<SearchResponse<Class>>(
    ApiMethod.GET,
    "/classes",
    params
  );
  return res;
}

export async function createClass(params: CreateClassRequest): Promise<Class> {
  const res = await apiRequest<Class>(ApiMethod.POST, "/classes", params);
  return res;
}

export async function getClassById(id: string): Promise<Class> {
  const res = await apiRequest<Class>(ApiMethod.GET, `/classes/${id}`);
  return res;
}

export interface UpdateClassRequest {
  name: string;
  code: string;
  colorCode: string;
  startTime: Date;
  endTime: Date | null;
}

export async function updateClass(
  id: string,
  params: UpdateClassRequest
): Promise<Class> {
  const res = await apiRequest<Class>(ApiMethod.PUT, `/classes/${id}`, params);
  return res;
}

export async function deleteClass(id: string): Promise<void> {
  await apiRequest<void>(ApiMethod.DELETE, `/classes/${id}`);
}

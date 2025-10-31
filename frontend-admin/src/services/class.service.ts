import { ApiMethod } from "../enums/apiMethod";
import type { SearchParams, SearchResponse } from "../models/base/search.model";
import type { Class } from "../models/class.model";
import { apiRequest } from "../utils/api.util";

export interface SearchClassRequest extends SearchParams {
  name?: string;
  code?: string;
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

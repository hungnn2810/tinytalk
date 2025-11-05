import { ApiMethod } from "../enums/ApiMethod";
import type { SearchParams, SearchResponse } from "../models/base/search.model";
import type { Homework } from "../models/homework.model";
import { apiRequest } from "../utils/api.util";

export interface SearchHomeworkRequest extends SearchParams {
  classId?: string;
}

export async function searchHomework(
  params: SearchHomeworkRequest
): Promise<SearchResponse<Homework>> {
  const res = await apiRequest<SearchResponse<Homework>>(
    ApiMethod.GET,
    "/homeworks",
    params
  );
  return res;
}

import { ApiMethod } from "../enums/ApiMethod";
import type { SearchParams, SearchResponse } from "../models/base/search.model";
import type { Parent } from "../models/parent.model";
import { apiRequest } from "../utils/api.util";

export interface SearchParentRequest extends SearchParams {
  keyword?: string;
}

export async function searchParent(
  params: SearchParentRequest
): Promise<SearchResponse<Parent>> {
  const res = await apiRequest<SearchResponse<Parent>>(
    ApiMethod.GET,
    "/parents",
    params
  );
  return res;
}

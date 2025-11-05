import { ApiMethod } from "../enums/ApiMethod";
import type { SearchParams, SearchResponse } from "../models/base/search.model";
import type { Library } from "../models/library.model";
import { apiRequest } from "../utils/api.util";

export interface SearchLibraryRequest extends SearchParams {
  name?: string;
}

export interface CreateLibraryRequest {
  name: string;
}

export async function searchLibrary(
  params: SearchLibraryRequest
): Promise<SearchResponse<Library>> {
  const res = await apiRequest<SearchResponse<Library>>(
    ApiMethod.GET,
    "/libraries",
    params
  );
  return res;
}

export async function createLibrary(
  params: CreateLibraryRequest
): Promise<Library> {
  const res = await apiRequest<Library>(ApiMethod.POST, "/libraries", params);
  return res;
}

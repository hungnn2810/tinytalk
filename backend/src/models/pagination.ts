export interface SearchParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface SearchResponseMetadata {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface SearchResponse<T> {
  data: T[];
  metadata: SearchResponseMetadata;
}

export function createSearchResponseMetadata(
  total: number,
  page: number,
  limit: number
): SearchResponseMetadata {
  const totalPages = Math.max(Math.ceil(total / limit), 1);

  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}

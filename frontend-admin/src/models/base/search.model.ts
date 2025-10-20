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

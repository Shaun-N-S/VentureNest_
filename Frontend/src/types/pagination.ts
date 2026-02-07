export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  hasNextPage: boolean;
}

export interface PaginatedResponses<T> {
  data: T[];
  total: number;
  hasNextPage: boolean;
}


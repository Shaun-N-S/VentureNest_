export interface PaginatedResponseDTO<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
}

// Common DTOs for API responses and requests

export interface ErrorResponse {
  message: string;
  code?: string;
  details?: unknown;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  orderBy?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

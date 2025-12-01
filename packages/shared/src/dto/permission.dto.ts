// Permission DTOs

export interface PermissionDto {
  userId: number;
  categoryId: number;
  user?: {
    id: number;
    username: string;
  };
  category?: {
    id: number;
    name: string;
    slug: string;
  };
}

export interface CreatePermissionDto {
  userId: number;
  categoryId: number;
}

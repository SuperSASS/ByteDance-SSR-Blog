// Permission DTOs

export interface PermissionDto {
  userId: number;
  categoryId: number;
}

export type UserPermissionDto = PermissionDto[];

export interface CreatePermissionDto {
  userId: number;
  categoryId: number;
}

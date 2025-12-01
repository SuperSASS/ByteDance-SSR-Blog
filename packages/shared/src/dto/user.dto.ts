// User DTOs

export type Role = 'USER' | 'ADMIN';

export interface UserDto {
  id: number;
  username: string;
  role: Role;
  createdAt: string;
}

export interface CreateUserDto {
  username: string;
  password: string;
  role?: Role;
}

export interface UpdateUserDto {
  username?: string;
  password?: string;
  role?: Role;
}

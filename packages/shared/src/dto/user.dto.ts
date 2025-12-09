// User DTOs

export type Role = 'USER' | 'EDITOR' | 'ADMIN';

export interface UserDto {
  id: number;
  username: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  role?: Role;
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  password?: string;
  role?: Role;
}

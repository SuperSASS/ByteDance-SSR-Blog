// Authentication DTOs

import type { Role } from './user.dto';

export interface LoginDto {
  username: string;
  password: string;
}

export interface AuthUserDto {
  id: number;
  username: string;
  role: Role;
  createdAt: string;
}

export interface AuthResponseDto {
  token: string;
  user: {
    id: number;
    username: string;
    role: Role;
  };
}

export interface AuthErrorDto {
  message: string;
}

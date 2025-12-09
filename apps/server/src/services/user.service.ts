import { prisma } from '../db/prisma.js';
import { User } from '@prisma/client';
import type {
  CreateUserDto,
  UpdateUserDto,
  UserDto,
  PaginationQuery,
} from 'ssr-blog-shared';

// Transform Prisma User to UserDto
function toUserDto(user: User): UserDto {
  return {
    id: user.id,
    username: user.username,
    email: user.email || '', // Add email
    role: user.role,
    createdAt: user.createdAt.toISOString(),
  };
}

export const userService = {
  async createUser(data: CreateUserDto): Promise<UserDto> {
    // TODO: Hash password before storing
    const user = await prisma.user.create({
      data: {
        username: data.username,
        email: data.email || `${data.username}@example.com`,
        passwordHash: data.password, // In production, hash this!
        role: data.role || 'USER',
      },
    });
    return toUserDto(user);
  },

  async updateUser(id: number, data: UpdateUserDto): Promise<UserDto> {
    const updateData: any = {};
    if (data.username) updateData.username = data.username;
    if (data.password) updateData.passwordHash = data.password; // Hash in production
    if (data.role) updateData.role = data.role;

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
    });
    return toUserDto(user);
  },

  async deleteUser(id: number): Promise<void> {
    await prisma.user.delete({
      where: { id },
    });
  },

  async getUserById(id: number): Promise<UserDto | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    return user ? toUserDto(user) : null;
  },

  async getUsers(query?: PaginationQuery): Promise<UserDto[]> {
    const users = await prisma.user.findMany({
      skip:
        query?.page && query?.limit
          ? (query.page - 1) * query.limit
          : undefined,
      take: query?.limit,
      orderBy: query?.orderBy
        ? { [query.orderBy]: query.order || 'asc' }
        : { createdAt: 'desc' },
    });
    return users.map(toUserDto);
  },
};

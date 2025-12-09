import { prisma } from '../db/prisma.js';
import { verifyPassword } from '../utils/hash.js';
import { signToken } from '../utils/jwt.js';
import type { AuthResponseDto, LoginDto } from 'ssr-blog-shared';

/**
 * 用户登录
 * @param loginDto 登录信息
 * @returns 认证响应(包含 token 和用户信息)
 * @throws 用户名或密码错误
 */
export async function login(loginDto: LoginDto): Promise<AuthResponseDto> {
  const { username, password } = loginDto;

  // 查找用户
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    throw new Error('用户名或密码错误');
  }

  // 验证密码
  const isPasswordValid = await verifyPassword(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new Error('用户名或密码错误');
  }

  // 生成 token
  const token = signToken({
    userId: user.id,
    username: user.username,
    role: user.role,
  });

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
    },
  };
}

/**
 * 根据 ID 获取用户信息
 * @param userId 用户 ID
 * @returns 用户信息
 * @throws 用户不存在
 */
export async function getUserById(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new Error('用户不存在');
  }

  return user;
}

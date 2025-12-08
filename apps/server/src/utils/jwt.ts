import jwt, { SignOptions } from 'jsonwebtoken';

export interface JwtPayload {
  userId: number;
  username: string;
  role: string;
}

/**
 * 生成 JWT token
 * @param payload token 载荷
 * @returns JWT token 字符串
 */
export function signToken(payload: JwtPayload): string {
  const secret = process.env.JWT_SECRET;
  const expires =
    (process.env.JWT_EXPIRES_IN as SignOptions['expiresIn']) || '7d';
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  return jwt.sign(payload, secret, {
    expiresIn: expires,
  });
}

/**
 * 验证 JWT token
 * @param token JWT token 字符串
 * @returns 解析后的 payload
 */
export function verifyToken(token: string): JwtPayload {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  return jwt.verify(token, secret) as JwtPayload;
}

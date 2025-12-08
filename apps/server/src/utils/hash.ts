import bcrypt from 'bcryptjs';

/**
 * 哈希密码
 * @param password 明文密码
 * @returns 哈希后的密码
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

/**
 * 验证密码
 * @param password 明文密码
 * @param hash 哈希后的密码
 * @returns 是否匹配
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

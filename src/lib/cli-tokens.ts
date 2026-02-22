import { redis } from '@/lib/redis';
import { randomBytes } from 'crypto';

const TOKEN_PREFIX = 'sh_cli_';
const TOKEN_TTL = 1800; // 30 minutes
const REDIS_KEY_PREFIX = 'shiphaus:cli-token:';

interface TokenData {
  email: string;
  name: string;
  avatar: string;
  image: string;
}

export async function generateCliToken(user: TokenData): Promise<{ token: string; expiresAt: string }> {
  const token = TOKEN_PREFIX + randomBytes(24).toString('hex');
  const key = REDIS_KEY_PREFIX + token;
  const expiresAt = new Date(Date.now() + TOKEN_TTL * 1000).toISOString();

  await redis.hset(key, {
    email: user.email,
    name: user.name,
    avatar: user.avatar,
    image: user.image,
    expires: expiresAt,
  });
  await redis.expire(key, TOKEN_TTL);

  return { token, expiresAt };
}

export async function validateCliToken(token: string): Promise<TokenData | null> {
  if (!token.startsWith(TOKEN_PREFIX)) return null;
  const key = REDIS_KEY_PREFIX + token;
  const data = await redis.hgetall(key) as Record<string, string> | null;
  if (!data || !data.email) return null;
  return { email: data.email, name: data.name, avatar: data.avatar, image: data.image };
}

export async function consumeCliToken(token: string): Promise<void> {
  await redis.del(REDIS_KEY_PREFIX + token);
}

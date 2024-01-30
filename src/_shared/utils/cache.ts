// Utils
import * as Redis from './redis.ts';

export async function cache(key: string, data: Record<any, any>, skipRedis?: boolean) {
  globalThis.cache[key] = data;

  if (!skipRedis) {
    await Redis.cache(key, data)
  }
}

export async function uncache(key: string) {
  if (key in globalThis.cache) {
    delete globalThis.cache[key];
  }

  await Redis.uncache(key)
}

export async function get(key: any) {
  const findInCache = globalThis.cache[key];
  if (findInCache) {
    return findInCache;
  }

  // Try to find on redis.
  const findInRedis = await Redis.get(key);

  if (findInRedis) {
    cache(key, findInRedis, true)
  }

  return findInRedis;
}
// Packages
import { connect } from "https://deno.land/x/redis/mod.ts";

// Utils
import isDenoDeploy from "#utils/is.deno.deploy.ts";
import { encrypt, decrypt } from '#utils/encryption.ts';

interface Env {
  PG_DB_CONN_STRING?: string;
}

async function conn() {
  if (globalThis.redis) {
    return globalThis.redis;
  };

  const hostname = Deno.env.get('REDIS_HOST')!;
  const port = Number(Deno.env.get('REDIS_PORT'));
  const password = Deno.env.get('REDIS_PASSWORD');

  const redis = await connect({
    hostname,
    port,
    password,
    tls: isDenoDeploy(),
  });

  globalThis.redis = redis;
  return redis;
}

export async function cache(key: string, data: Record<any, any>) {
  const newData = await encrypt(JSON.stringify({ data }));

  const value = await (await conn()).set(key, newData);
  return value
}

export async function uncache(key: string) {
  const value = await (await conn()).del(key);
  return value
}

export async function get(key: any) {
  const value = await (await conn()).get(key);
  if (value) {
    const decrypted = await decrypt(value)!;
    const parsedValue = JSON.parse(decrypted);
    
    // Adonis v5 by pass
    if ('message' in parsedValue) {
      return JSON.parse(parsedValue.message);
    }

    return parsedValue?.message.data || parsedValue?.data;
  }

  return value
}
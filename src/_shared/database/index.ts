import { ConnectionError, Pool, PoolClient } from "postgres";
import { drizzle } from 'drizzle-orm/pg-proxy';

// Schema
import { schema } from './schema.ts';

// Utils
import { startEndpoint } from "#utils/neon.ts";

interface Env {
  PG_CONN_STRING?: string;
}

async function runQuery(connection: PoolClient, sql: string, params: any[], reconnect?: boolean) {
  if (reconnect) {
    await startEndpoint();
    await connection.connect();
  }

  const rows = await connection.queryArray(sql, params);
  connection.release();
  return { rows: rows.rows };
}

export default async function buildDbClient() {
  if (globalThis.db) {
    return globalThis.db;
  }

  const connectionString = Deno.env.get('PG_CONN_STRING')!

  if (connectionString === undefined) {
    throw new Error("host is not defined");
  }

  await startEndpoint();

  // Create a database pool with three connections that are lazily established
  const pool = new Pool(connectionString, 2, true);

  // Connect to the database
  const connection = await pool.connect();

  const orm = drizzle(async (sql, params) => {
    try {
      return await runQuery(connection, sql, params);
    } catch (e: any) {
      // By pass for Serverless db shutdown and connection terminated unexpectedly
      console.error('Error from pg proxy server: ', e?.response?.data || e?.respone || e)
      if (e instanceof ConnectionError) {
        return await runQuery(connection, sql, params, true)
      }

      connection.release();
      return { rows: [] };
    }
  }, { schema });

  globalThis.db = orm;

  return orm;
}

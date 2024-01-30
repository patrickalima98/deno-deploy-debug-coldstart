import { Redis } from "https://deno.land/x/redis@v0.32.1/mod.ts";
import { PgRemoteDatabase } from 'drizzle-orm/pg-proxy';

// Schema
import { schema } from './database/schema.ts';

interface WindowEventMap {
  "redis:uncache": CustomEvent<any>;
}

type TlazyRouters = Record<string, () => Promise<any>>

declare global {
  // interface WindowEventMap { //adds definition to Document, but you can do the same with HTMLElement
  //     addEventListener<K extends keyof CustomEventMap>(type: K,
  //        listener: (this: WindowEventMap, ev: CustomEventMap[K]) => void): void;
  //     dispatchEvent<K extends keyof CustomEventMap>(ev: CustomEventMap[K]): void;
  // }
  interface WindowEventMap {
    "cache:uncache": CustomEvent<{ id: string }>;
  }

  var redis: Redis;
  var cache: Record<string, any>;
  var pg_started_at: Date;
  var db: PgRemoteDatabase<typeof schema>
}
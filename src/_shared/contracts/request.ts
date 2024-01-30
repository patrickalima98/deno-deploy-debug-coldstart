// deno-lint-ignore-file no-empty-interface
import { Context } from "hono/context.ts";
import { TUserInfo } from "#db/schemas";

export type HonoVariables = {
  Variables: {
    session_token: string;
    user: TUserInfo;
  }
}

// deno-lint-ignore ban-types
export interface IHonoRequest extends Context<HonoVariables, any, {}> {}

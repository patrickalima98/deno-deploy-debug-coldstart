import { config } from 'npm:dotenv';
import { Hono } from "hono/preset/quick.ts";
import { HonoVariables } from "../_shared/contracts/request.ts";
import isDenoDeploy from "../_shared/utils/is.deno.deploy.ts";

// Middlewares
import AuthApiGatewayMiddleware from "../_shared/middlewares/auth.api.gateway.ts";

export default async function() {
  if (isDenoDeploy()) {
    config();
  }
  
  globalThis.cache = {};

  const app = new Hono<HonoVariables>();

  // Protect api and only allow request from Api Gateway.
  app.use('*', AuthApiGatewayMiddleware);

  app.onError((err: any, c): any => {
    if (err.message === 'Validation failure') {
      return c.json({ errors: err.messages }, err.status)
    }

    return c.json(err.error, err.status)
  })

  return app;
}
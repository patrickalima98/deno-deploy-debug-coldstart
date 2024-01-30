// Packages
import { Next } from "hono/types.ts";
import { IHonoRequest } from "#contracts/request.ts";

// Exceptions
import InternalValidation from "../exceptions/InternalValidation.ts";

// Utils
import isDenoDeploy from "#utils/is.deno.deploy.ts";

export default async function AuthApiGatewayMiddleware(c: IHonoRequest, next: Next) {
  const authorization = c.req.header("nnp-api-g-key")?.split(" ").pop();
  const gatewayKey = Deno.env.get('API_GATEWAY_KEY');

  if (!isDenoDeploy()) {
    return next();
  }

  if (authorization && authorization === gatewayKey) {
    return next();
  }

  throw new InternalValidation('AUTH-NA-10', 401)
}
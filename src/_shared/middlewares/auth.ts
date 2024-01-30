// Packages
import { Next } from "hono/types.ts";
import { IHonoRequest } from "#contracts/request.ts";
import dayjs from 'dayjs';

// Services
import { makeCacheKeyName } from '#utils/sessions.ts';
import * as User from '#utils/users.ts'

// Exceptions
import InternalValidation from "../exceptions/InternalValidation.ts";

// Utils
import { get } from '#utils/cache.ts';

export default async function AuthMiddleware(c: IHonoRequest, next: Next) {
  const authorization = c.req.header("Authorization")?.split(" ").pop();
  let redis_id = '';
  if (authorization && authorization !== 'undefined') {

    console.time('console.log redis test')
    redis_id = makeCacheKeyName(authorization);

    const getKey = await get(redis_id);
    const data = getKey?.data;
    console.timeEnd('console.log redis test')

    if (!data) {
      throw new InternalValidation('AUTH-NA-10', 401)
    }

    if (dayjs(dayjs()).isAfter(getKey.expire_at)) {
      throw new InternalValidation('AUTH-NA-10', 401)
    }

    if (getKey?.data?.user?.idp_id) {
        console.time('console.log poly test')
        const user = await User.getByIdpId(data.user.idp_id);
        console.timeEnd('console.log poly test')

        if (user) {
          c.set('user', user as any)
          c.set('session_token', authorization)
          return next();
        }
    }
  }

  if (redis_id) {
    const event = new CustomEvent('redis:uncache', { detail: { id: redis_id } });
    dispatchEvent(event)
  }

  throw new InternalValidation('AUTH-NA-10', 401)
}
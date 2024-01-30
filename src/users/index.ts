// Packages
import Hono from '../_shared/base.router.ts';
import AuthMiddleware from "../_shared/middlewares/auth.ts";

// Services
import { getByIdpId } from './service.ts';

// Middlewares

// Validators

// Presenters
import { formatUserInfo } from './presenter.ts';

const r = (await Hono()).basePath('/user');

r.use('*', AuthMiddleware)

r.get('/me', async (c) => {
  const data = await getByIdpId(c.get('user').idp_id)
  return c.json(formatUserInfo(data))
});

export default r;
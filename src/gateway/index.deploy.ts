import { config } from 'npm:dotenv';
import { Hono } from "hono/preset/quick.ts";
config();

const app = new Hono();

// Protect api and only allow request from Api Gateway.
// app.use('*', AuthApiGatewayMiddleware);

app.onError((err: any, c): any => {
  if (err.message === 'Validation failure') {
    return c.json({ errors: err.messages }, err.status)
  }

  return c.json(err.error, err.status)
})

const routes = {
  user: 'nnp-nacct-user-mod',
}

app.all('*', (c) => {
  const url = new URL(c.req.url);
  const { pathname, search } = url;
  const pathWithParams = pathname + search;
  
  const foward2 = url.pathname.match(new RegExp(Object.keys(routes).join('|')));
  if (foward2 && foward2.length) {
    const newPath = `https://${routes[foward2[0] as keyof typeof routes]}-${Deno.env.get('ENV_TYPE')}.deno.dev` ;
    console.info('newPath ', newPath + pathWithParams)
    const newReq = new Request(newPath + pathWithParams, c.req.raw);
    // Add a custom header with a value
    newReq.headers.append(
      'nnp-api-g-key',
      Deno.env.get('API_GATEWAY_KEY')!,
    );

    return fetch(newReq);
  }

  return c.text('');
})

Deno.serve(app.fetch);
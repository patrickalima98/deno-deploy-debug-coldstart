import router from './index.ts';

Deno.serve(router.fetch);
export async function startEndpoint() {
  const apiKey = Deno.env.get('NEON_API_KEY');
  const endpoint = Deno.env.get('NEON_DATABASE_ENDPOINT');
  const id = Deno.env.get('NEON_DATABASE_ID');
  const difference = Math.abs((globalThis?.pg_started_at || new Date()).getTime() - (new Date()).getTime());
  let resultInMinutes = Math.round(difference / 60000);


  if (!globalThis?.pg_started_at) {
    resultInMinutes = 60;
  }

  console.info('globalThis.pg_started_at ', globalThis.pg_started_at);

  if (apiKey && endpoint && id && resultInMinutes > 15) {
    globalThis.pg_started_at = new Date();

    await fetch(`https://console.neon.tech/api/v2/projects/${id}/endpoints/${endpoint}/start`, {
      method: 'post',
      headers: {
        'authorization': `Bearer ${apiKey}`
      }
    })
  }
}
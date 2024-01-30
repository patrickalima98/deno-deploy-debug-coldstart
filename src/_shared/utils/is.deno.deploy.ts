export default function isDenoDeploy() {
  return Deno.env.get("DENO_DEPLOYMENT_ID") !== undefined;
}
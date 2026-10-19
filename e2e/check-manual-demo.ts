import { request, type FullConfig } from "@playwright/test";
export default async function checkManualDemo(config: FullConfig) {
  const client = await request.newContext({ baseURL: config.projects[0].use.baseURL });
  try {
    const root = await client.get("/");
    if (!root.ok() || !(await root.text()).includes("Work Trail — Today"))
      throw Error("The URL does not serve the reviewed 66940bf candidate. No browser records were touched.");
    const availability = await client.get("/api/plan?availability=1");
    const body = await availability.json();
    if (!availability.ok() || body.available !== false || !body.message?.startsWith("Public AI is disabled"))
      throw Error("The URL is not the required production/manual build. Stop; do not generate AI plans.");
  } finally { await client.dispose(); }
}

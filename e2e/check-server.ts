import { request, type FullConfig } from "@playwright/test";

export default async function checkServer(config: FullConfig) {
  const client = await request.newContext({ baseURL: config.projects[0].use.baseURL });
  try {
    const response = await client.get("/", { timeout: 30_000 });
    if (!response.ok() || !(await response.text()).includes("Trail. — Today"))
      throw Error("The test URL is not serving Work Trail. Check PW_BASE_URL and restart the intended app; no existing server was stopped.");
  } finally {
    await client.dispose();
  }
}

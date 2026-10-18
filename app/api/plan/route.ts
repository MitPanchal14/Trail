import { planRequestSchema } from "@/lib/planning";
import { boundedText, generatePlan, PlanningError, planningAvailability } from "@/lib/gemini.server";
export const runtime = "nodejs";
export async function GET() {
  return Response.json(planningAvailability(), { headers: { "Cache-Control": "no-store" } });
}
export async function POST(request: Request) {
  const headers = { "Cache-Control": "no-store" };
  try {
    const origin = request.headers.get("origin"),
      url = new URL(request.url),
      source = origin ? new URL(origin) : null;
    if (
      !origin ||
      !source ||
      source.origin !== origin ||
      source.host !== request.headers.get("host") ||
      source.protocol !== url.protocol ||
      !["localhost", "127.0.0.1", "[::1]"].includes(source.hostname)
    )
      throw new PlanningError(
        403,
        "ORIGIN",
        "Planning requests are allowed only from the local app.",
      );
    if (!request.headers.get("content-type")?.startsWith("application/json"))
      throw new PlanningError(
        400,
        "CONTENT_TYPE",
        "Send a JSON planning request.",
      );
    if (Number(request.headers.get("content-length")) > 32768)
      throw new PlanningError(400, "SIZE", "Planning input exceeds 32 KB.");
    let input;
    try {
      input = planRequestSchema.parse(
        JSON.parse(await boundedText(new Response(request.body), 32768)),
      );
    } catch {
      throw new PlanningError(
        400,
        "INVALID_REQUEST",
        "Check the input lengths and candidate actions. Your input is retained.",
      );
    }
    const result = await generatePlan(input, request.signal);
    return Response.json(result, { headers });
  } catch (error) {
    const e =
      error instanceof PlanningError
        ? error
        : new PlanningError(
            502,
            "PLANNING_FAILED",
            "Planning is unavailable. Retry explicitly or use manual editing.",
          );
    return Response.json(
      { error: { code: e.code, message: e.message } },
      { status: e.status, headers },
    );
  }
}

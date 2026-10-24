import { describe, expect, it, vi } from "vitest";
import { parsePlanResponse, planRequestSchema, type PlanRequest } from "../lib/planning";
import { generatePlan } from "../lib/gemini.server";

const request = {
  kind: "progress-update", update: "I read the example. The practice question is left.",
  action: "Read and practise", instruction: "Read the example and attempt the question.", previousReturnStep: "",
} satisfies PlanRequest;
const draft = { kind: "progress-update", note: "Read the example; practice question remains.", returnStep: "Attempt the practice question without looking at the example." };
const env = { NODE_ENV: "test", ENABLE_AI_PLANNING: "true", GEMINI_API_KEY: "fictional-test-key", GEMINI_MODEL: "test-model" };
const response = (data: unknown) => new Response(JSON.stringify({ candidates: [{ finishReason: "STOP", content: { parts: [{ text: JSON.stringify(data) }] } }] }));

describe("progress suggestions are bounded text, not work commands", () => {
  it("accepts the bounded update and clarification, rejects fabricated state fields and wrong-kind replies", () => {
    expect(planRequestSchema.parse(request)).toEqual(request);
    expect(parsePlanResponse(draft, request)).toEqual(draft);
    expect(parsePlanResponse({ kind: "clarification", question: "Which question remains?" }, request)).toMatchObject({ kind: "clarification" });
    for (const extra of [{ completed: true }, { minutes: 30 }, { reminder: "tomorrow" }, { subtaskId: "other-action" }])
      expect(() => parsePlanResponse({ ...draft, ...extra }, request)).toThrow();
    expect(() => parsePlanResponse({ kind: "day", orderedSubtaskIds: [], reason: "Changed plan" }, request)).toThrow();
  });
  it("enforces input/output bounds and refuses blank updates or ungrounded empty return steps", () => {
    expect(planRequestSchema.safeParse({ ...request, update: " " }).success).toBe(false);
    expect(planRequestSchema.safeParse({ ...request, update: "x".repeat(2001) }).success).toBe(false);
    expect(planRequestSchema.safeParse({ ...request, instruction: "x".repeat(501) }).success).toBe(false);
    expect(() => parsePlanResponse({ ...draft, note: "x".repeat(2001) }, request)).toThrow();
    expect(() => parsePlanResponse({ ...draft, returnStep: "x".repeat(501) }, request)).toThrow();
    expect(() => parsePlanResponse({ ...draft, returnStep: " " }, request)).toThrow();
  });
  it("uses the existing configured adapter, isolates context as data, and validates provider output", async () => {
    const fetcher = vi.fn(async () => response(draft));
    await expect(generatePlan(request, new AbortController().signal, env, fetcher)).resolves.toEqual(draft);
    const body = JSON.parse(String((fetcher.mock.calls[0] as unknown as [string, RequestInit])[1].body));
    expect(JSON.parse(body.contents[0].parts[0].text)).toEqual(request);
    expect(body.systemInstruction.parts[0].text).toContain("never complete actions");
    expect(JSON.stringify(body.generationConfig.responseFormat.text.schema)).toContain("progress-update");
    await expect(generatePlan(request, new AbortController().signal, env, async () => response({ ...draft, completed: true }))).rejects.toMatchObject({ code: "INVALID_RESPONSE" });
  });
  it("keeps the production lock for the new progress request kind", async () => {
    const fetcher = vi.fn();
    await expect(generatePlan(request, new AbortController().signal, { ...env, NODE_ENV: "production" }, fetcher)).rejects.toMatchObject({ code: "PUBLIC_AI_DISABLED" });
    expect(fetcher).not.toHaveBeenCalled();
  });
});

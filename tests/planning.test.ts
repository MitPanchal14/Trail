import { describe, it, expect, vi, afterEach } from "vitest";
import {
  planRequestSchema,
  parsePlanResponse,
  newDraft,
  RequestGate,
  combinedDescription,
  type PlanRequest,
} from "../lib/planning";
import { generatePlan, planningAvailability } from "../lib/gemini.server";
import { GET, POST } from "../app/api/plan/route";
import { emptySnapshot, snapshotSchema, activeCompletion } from "../lib/domain";
import { transition, recoverSnapshot } from "../lib/actions";
const input = {
  kind: "breakdown",
  description: "Make a fictional tree guide.",
} satisfies PlanRequest;
const result = {
  kind: "breakdown" as const,
  goal: "Tree guide",
  finishCondition: "One checked printable page",
  steps: [
    {
      title: "Sketch a leaf",
      nextAction: "Draw one oak leaf and label three visible veins.",
      suggestedMinutes: 15,
    },
    {
      title: "Check the page",
      nextAction: "Read the draft once and mark unclear labels.",
      suggestedMinutes: 10,
    },
  ],
};
const env = {
  NODE_ENV: "test",
  GEMINI_API_KEY: "test-only-not-a-key",
  GEMINI_MODEL: "configured-test-model",
  ENABLE_AI_PLANNING: "true",
};
const signal = () => new AbortController().signal;
const response = (value: unknown) =>
  new Response(
    JSON.stringify({
      candidates: [
        {
          finishReason: "STOP",
          content: { parts: [{ text: JSON.stringify(value) }] },
        },
      ],
    }),
  );
const mocked = (implementation: () => Promise<Response>) =>
  vi.fn(implementation) as unknown as typeof fetch;
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});
describe("bounded Gemini adapter and route", () => {
  it("reports configuration without provider calls, secrets or production bypass", async () => {
    const fetcher = vi.fn();
    vi.stubGlobal("fetch", fetcher);
    expect(planningAvailability({}).available).toBe(false);
    expect(planningAvailability(env).available).toBe(true);
    expect(planningAvailability({ ...env, GEMINI_MODEL: "bad/model" }).available).toBe(false);
    expect(planningAvailability({ ...env, NODE_ENV: "production", PUBLIC_AI_PROTECTION_ENABLED: "true" }).available).toBe(false);
    vi.stubEnv("NODE_ENV", "production");
    const reply = await GET();
    expect(reply.headers.get("cache-control")).toBe("no-store");
    expect(await reply.json()).toMatchObject({ available: false });
    expect(JSON.stringify(planningAvailability(env))).not.toContain(env.GEMINI_API_KEY);
    expect(fetcher).not.toHaveBeenCalled();
  });
  it("validates bounded request/response contracts and focused clarification", () => {
    expect(
      planRequestSchema.safeParse({ ...input, description: "x".repeat(6001) })
        .success,
    ).toBe(false);
    expect(
      planRequestSchema.safeParse({ ...input, extra: "untrusted" }).success,
    ).toBe(false);
    expect(
      parsePlanResponse(
        { kind: "clarification", question: "What should this guide cover?" },
        input,
      ),
    ).toMatchObject({ kind: "clarification" });
    expect(() => parsePlanResponse({ ...result, steps: [] }, input)).toThrow();
    expect(() =>
      parsePlanResponse(
        { ...result, steps: [{ ...result.steps[0], suggestedMinutes: 0 }] },
        input,
      ),
    ).toThrow();
  });
  it("uses only configured server model, bounded schema output and separated user data", async () => {
    const fetcher = vi.fn(async () => response(result));
    await expect(generatePlan(input, signal(), env, fetcher)).resolves.toEqual(
      result,
    );
    const [url, init] = fetcher.mock.calls[0] as unknown as [
      string,
      RequestInit,
    ];
    expect(url).toContain("/configured-test-model:generateContent");
    const body = JSON.parse(String(init.body));
    expect(body.generationConfig.maxOutputTokens).toBe(4096);
    expect(body.generationConfig.responseFormat.text.mimeType).toBe(
      "APPLICATION_JSON",
    );
    expect(body.systemInstruction.parts[0].text).toContain("DATA");
    expect(body.contents[0].parts[0].text).toContain(input.description);
    const schema = body.generationConfig.responseFormat.text.schema;
    expect(schema.anyOf[0].properties.kind).toEqual({ type: "string", enum: ["breakdown"] });
    expect(schema.anyOf[0].properties.steps.items.properties.suggestedMinutes)
      .toMatchObject({ type: "integer", minimum: 1, maximum: 120 });
    expect(JSON.stringify(schema)).not.toMatch(/"(?:\$schema|const|minLength|maxLength|pattern|format)":/);
  });
  it("distinguishes blocked and incomplete provider output without accepting partial JSON", async () => {
    for (const [payload, code] of [
      [{ promptFeedback: { blockReason: "SAFETY" } }, "BLOCKED"],
      [{ candidates: [{ finishReason: "SAFETY" }] }, "BLOCKED"],
      [{ candidates: [{ finishReason: "MAX_TOKENS", content: { parts: [{ text: JSON.stringify(result) }] } }] }, "INCOMPLETE"],
      [{ candidates: [{ content: { parts: [{ text: JSON.stringify(result) }] } }] }, "INCOMPLETE"],
    ] as const) {
      await expect(generatePlan(input, signal(), env, mocked(async () =>
        new Response(JSON.stringify(payload)),
      ))).rejects.toMatchObject({ code });
    }
  });
  it("parses only final text, not thinking parts, and validates the assembled result", async () => {
    const fetcher = mocked(async () => new Response(JSON.stringify({ candidates: [{
      finishReason: "STOP", content: { parts: [
        { thought: true, text: "private internal reasoning, not JSON" },
        { text: JSON.stringify(result).slice(0, 30) },
        { text: JSON.stringify(result).slice(30) },
      ] },
    }] })));
    await expect(generatePlan(input, signal(), env, fetcher)).resolves.toEqual(result);
  });
  it("reports provider request/access/model/quota failures without exposing upstream details", async () => {
    for (const [status, code] of [[400, "PROVIDER_REQUEST"], [401, "PROVIDER_ACCESS"],
      [403, "PROVIDER_ACCESS"], [404, "MODEL_UNAVAILABLE"], [429, "QUOTA"]] as const) {
      const error = await generatePlan(input, signal(), env,
        mocked(async () => new Response("sensitive upstream detail", { status })),
      ).catch((e) => e);
      expect(error.code).toBe(code);
      expect(error.message).not.toContain("sensitive");
    }
  });
  it("missing configuration and production disable make no upstream requests", async () => {
    const fetcher = mocked(async () => response(result));
    await expect(
      generatePlan(input, signal(), {}, fetcher),
    ).rejects.toMatchObject({ code: "AI_UNAVAILABLE" });
    await expect(
      generatePlan(
        input,
        signal(),
        {
          ...env,
          NODE_ENV: "production",
          PUBLIC_AI_PROTECTION_ENABLED: "true",
        },
        fetcher,
      ),
    ).rejects.toMatchObject({ code: "PUBLIC_AI_DISABLED" });
    expect(fetcher).not.toHaveBeenCalled();
  });
  it("rejects upstream invalid JSON/schema, quota errors, and oversize output without leaking content", async () => {
    for (const reply of [
      new Response("{bad"),
      response({ ...result, goal: "" }),
      new Response("private upstream detail", { status: 429 }),
      new Response("x".repeat(65537)),
    ]) {
      await expect(
        generatePlan(
          input,
          signal(),
          env,
          mocked(async () => reply),
        ),
      ).rejects.toMatchObject({ status: reply.status === 429 ? 429 : 502 });
    }
  });
  it("times out and cancels without retry loops", async () => {
    vi.useFakeTimers();
    const fetcher = vi.fn(
      (_url: unknown, init?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () =>
            reject(new DOMException("Aborted", "AbortError")),
          );
        }),
    );
    const pending = expect(
      generatePlan(input, signal(), env, fetcher),
    ).rejects.toMatchObject({ code: "TIMEOUT" });
    await vi.advanceTimersByTimeAsync(25001);
    await pending;
    expect(fetcher).toHaveBeenCalledTimes(1);
    const controller = new AbortController();
    const cancelled = expect(
      generatePlan(input, controller.signal, env, fetcher),
    ).rejects.toMatchObject({ code: "CANCELLED" });
    controller.abort();
    await cancelled;
  });
  it("rejects unknown/duplicate day IDs and over-budget suggestions", () => {
    const id = crypto.randomUUID();
    const request: PlanRequest = {
      kind: "day",
      availability: "Available minutes: 10\nBusy day",
      candidates: [{ id, title: "Sketch leaf", suggestedMinutes: 15 }],
    };
    for (const ids of [[crypto.randomUUID()], [id, id], [id]])
      expect(() =>
        parsePlanResponse(
          { kind: "day", orderedSubtaskIds: ids, reason: "A manageable start" },
          request,
        ),
      ).toThrow();
    expect(
      parsePlanResponse(
        {
          kind: "day",
          orderedSubtaskIds: [],
          reason: "No candidate fits the available commitment.",
        },
        request,
      ),
    ).toMatchObject({ orderedSubtaskIds: [] });
  });
  it("route rejects untrusted origin and body, and returns an honest missing-config envelope", async () => {
    const req = (body: unknown, origin = "http://localhost:3000") =>
      new Request("http://localhost:3000/api/plan", {
        method: "POST",
        headers: {
          host: "localhost:3000",
          origin,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
    expect((await POST(req(input, "https://untrusted.example"))).status).toBe(
      403,
    );
    expect((await POST(req({ kind: "unknown" }))).status).toBe(400);
    vi.stubEnv("ENABLE_AI_PLANNING", "false");
    const reply = await POST(req(input));
    expect(reply.status).toBe(503);
    expect(await reply.json()).toHaveProperty("error.code", "AI_UNAVAILABLE");
  });
  it("invalidates duplicate and stale responses on a new request, edit or cancellation", () => {
    const gate = new RequestGate();
    const first = gate.begin(),
      second = gate.begin();
    expect(first.signal.aborted).toBe(true);
    expect(gate.current(first.id)).toBe(false);
    expect(gate.current(second.id)).toBe(true);
    gate.cancel();
    expect(gate.current(second.id)).toBe(false);
  });
});
describe("review acceptance, stable history and daily commitments", () => {
  const now = Date.parse("2026-10-15T12:00:00Z");
  function accepted() {
    let s = emptySnapshot(now);
    s.calendarTimeZone = "UTC";
    const d = {
      ...newDraft(),
      description: input.description,
      alreadyDone: "Collected photographs",
      stuck: "Need a first page",
      goal: result.goal,
      finishCondition: result.finishCondition,
      steps: result.steps.map((x) => ({
        ...x,
        key: crypto.randomUUID(),
        existingId: null,
      })),
    };
    s = transition(s, { type: "draft", draft: d }, now);
    return { s, d };
  }
  it("persists clarification/context without achievements; accepts reviewed draft once", () => {
    let { s, d } = accepted();
    s = transition(
      s,
      { type: "draft", draft: { ...d, clarification: "Which trees?" } },
      now,
    );
    expect(combinedDescription(s.creationDraft!)).toContain(
      "Collected photographs",
    );
    expect(
      snapshotSchema.parse(JSON.parse(JSON.stringify(s))).creationDraft
        ?.clarification,
    ).toBe("Which trees?");
    expect(s.mountains).toHaveLength(0);
    s = transition(s, { type: "accept", draftId: d.id }, now);
    s = transition(s, { type: "accept", draftId: d.id }, now);
    expect(s.mountains).toHaveLength(1);
    expect(s.subtasks).toHaveLength(2);
    expect(s.completions).toHaveLength(0);
    expect(s.sessions).toHaveLength(0);
    expect(new Set(s.subtasks.map((t) => t.id)).size).toBe(2);
    expect(s.subtasks.map((t) => t.checkpointSlot)).toEqual([0, 1]);
  });
  it("archives removed accepted work without erasing history or moving other earned slots", () => {
    let { s, d } = accepted();
    s = transition(s, { type: "accept", draftId: d.id }, now);
    s = transition(s, { type: "start", minutes: 1 }, now);
    s = transition(s, { type: "complete" }, now + 1000);
    const first = s.subtasks[0],
      second = s.subtasks[1];
    const edit = {
      ...d,
      id: crypto.randomUUID(),
      editingMountainId: s.mountains[0].id,
      steps: [
        { ...result.steps[1], key: crypto.randomUUID(), existingId: second.id },
        {
          ...result.steps[0],
          key: crypto.randomUUID(),
          existingId: null,
          title: "New action",
        },
      ],
    };
    s = transition(s, { type: "draft", draft: edit }, now + 2000);
    s = transition(s, { type: "accept", draftId: edit.id }, now + 2000);
    expect(
      s.subtasks.find((t) => t.id === first.id)?.archivedAt,
    ).not.toBeNull();
    expect(activeCompletion(s, first.id)).toBeDefined();
    expect(s.sessions[0].creditedMs).toBe(1000);
    expect(s.subtasks.find((t) => t.id === second.id)?.checkpointSlot).toBe(1);
    expect(
      s.subtasks.find((t) => t.title === "New action")?.checkpointSlot,
    ).toBe(2);
    expect(() => snapshotSchema.parse(s)).not.toThrow();
  });
  it("keeps draft ordering separate; commits once and retains removed/deferred history", () => {
    let { s, d } = accepted();
    s = transition(s, { type: "accept", draftId: d.id }, now);
    const ids = s.subtasks.map((t) => t.id);
    s = transition(
      s,
      {
        type: "day-draft",
        date: "2026-10-15",
        availability: "Busy",
        minutes: 20,
        ids,
      },
      now,
    );
    expect(s.dayPlans[0].commitments).toHaveLength(0);
    s = transition(s, { type: "day-commit", date: "2026-10-15" }, now);
    const commitmentIds = s.dayPlans[0].commitments.map((c) => c.id);
    s = transition(s, { type: "day-commit", date: "2026-10-15" }, now);
    expect(s.dayPlans[0].commitments.map((c) => c.id)).toEqual(commitmentIds);
    s = transition(
      s,
      {
        type: "day-draft",
        date: "2026-10-15",
        availability: "Busy",
        minutes: 20,
        ids: [ids[1], ids[0]],
      },
      now,
    );
    expect(s.dayPlans[0].commitments.map((c) => c.subtaskId)).toEqual(ids);
    s = transition(
      s,
      {
        type: "disposition",
        date: "2026-10-15",
        id: commitmentIds[0],
        disposition: "removed",
      },
      now,
    );
    s = transition(
      s,
      {
        type: "disposition",
        date: "2026-10-15",
        id: commitmentIds[1],
        disposition: "deferred",
      },
      now,
    );
    expect(s.dayPlans[0].commitments.map((c) => c.disposition)).toEqual([
      "removed",
      "deferred",
    ]);
    expect(s.completions).toHaveLength(0);
    expect(() => snapshotSchema.parse(s)).not.toThrow();
  });
  it("rejects unknown actions in daily drafts and preserves old slice 2 snapshots", () => {
    let { s } = accepted();
    s.creationDraft = null;
    expect(() => snapshotSchema.parse(s)).not.toThrow();
    expect(() =>
      transition(
        s,
        {
          type: "day-draft",
          date: "2026-10-15",
          availability: "",
          minutes: null,
          ids: [crypto.randomUUID()],
        },
        now,
      ),
    ).toThrow();
    expect(recoverSnapshot(s).sessions).toEqual([]);
  });
  it("reload prioritizes saved work over committed order, and ignores yesterday’s commitments without erasing them", () => {
    let { s, d } = accepted();
    s = transition(s, { type: "accept", draftId: d.id }, now);
    const [a, b] = s.subtasks;
    s = transition(
      s,
      {
        type: "day-draft",
        date: "2026-10-15",
        availability: "",
        minutes: 30,
        ids: [b.id, a.id],
      },
      now,
    );
    s = transition(s, { type: "day-commit", date: "2026-10-15" }, now);
    expect(recoverSnapshot(s, now).selection.selectedSubtaskId).toBe(b.id);
    s = transition(s, { type: "select", id: a.id }, now);
    s = transition(s, { type: "start", minutes: 1 }, now);
    s = transition(s, { type: "note", note: "Add three veins next." }, now);
    s = transition(s, { type: "save" }, now + 1000);
    expect(recoverSnapshot(s, now + 2000).selection.selectedSubtaskId).toBe(
      a.id,
    );
    expect(recoverSnapshot(s, now + 86400000).sessions[0].note).toBe(
      "Add three veins next.",
    );
    expect(
      recoverSnapshot(s, now + 86400000).dayPlans[0].commitments,
    ).toHaveLength(2);
    expect(() =>
      transition(
        s,
        {
          type: "day-draft",
          date: "2026-10-15",
          availability: "",
          minutes: 30,
          ids: [b.id],
        },
        now + 86400000,
      ),
    ).toThrow("Today changed");
  });
});

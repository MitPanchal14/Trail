import { z } from "zod";
const text = z.string().trim().min(1).max(500);
export const stepSchema = z
  .object({
    title: text,
    nextAction: text,
    suggestedMinutes: z.number().int().min(1).max(120),
  })
  .strict();
export const breakdownSchema = z
  .object({
    kind: z.literal("breakdown"),
    goal: text,
    finishCondition: text,
    steps: z.array(stepSchema).min(1).max(20),
  })
  .strict();
export const clarificationSchema = z
  .object({ kind: z.literal("clarification"), question: text })
  .strict();
export const dayResponseSchema = z
  .object({
    kind: z.literal("day"),
    orderedSubtaskIds: z.array(z.uuid()).max(50),
    reason: z.string().trim().min(1).max(1000),
  })
  .strict();
export const planRequestSchema = z
  .discriminatedUnion("kind", [
    z
      .object({
        kind: z.literal("breakdown"),
        description: z.string().trim().min(1).max(6000),
      })
      .strict(),
    z
      .object({
        kind: z.literal("day"),
        availability: z.string().max(1000),
        candidates: z
          .array(
            z
              .object({
                id: z.uuid(),
                title: text,
                suggestedMinutes: z.number().int().min(1).max(120),
              })
              .strict(),
          )
          .max(50),
      })
      .strict(),
  ])
  .superRefine((r, ctx) => {
    if (
      r.kind === "day" &&
      new Set(r.candidates.map((c) => c.id)).size !== r.candidates.length
    )
      ctx.addIssue({ code: "custom", message: "Duplicate candidates" });
  });
export type PlanRequest = z.infer<typeof planRequestSchema>;
export type Breakdown = z.infer<typeof breakdownSchema>;
export function parsePlanResponse(input: unknown, request: PlanRequest) {
  if (request.kind === "breakdown")
    return z.union([breakdownSchema, clarificationSchema]).parse(input);
  const result = dayResponseSchema.parse(input),
    known = new Map(request.candidates.map((c) => [c.id, c]));
  if (
    new Set(result.orderedSubtaskIds).size !==
      result.orderedSubtaskIds.length ||
    result.orderedSubtaskIds.some((id) => !known.has(id))
  )
    throw Error("Invalid candidate IDs");
  const minutes = request.availability.match(/^Available minutes: (\d+)\n/);
  if (
    minutes &&
    result.orderedSubtaskIds.reduce(
      (sum, id) => sum + known.get(id)!.suggestedMinutes,
      0,
    ) > Number(minutes[1])
  )
    throw Error("Suggestion exceeds supplied availability");
  return result;
}
export const draftSchema = z
  .object({
    id: z.uuid(),
    editingMountainId: z.uuid().nullable(),
    description: z.string().max(6000),
    alreadyDone: z.string().max(2000),
    stuck: z.string().max(2000),
    constraints: z.string().max(2000),
    clarification: z.string().max(500),
    goal: z.string().max(500),
    finishCondition: z.string().max(500),
    steps: z
      .array(
        z
          .object({
            key: z.uuid(),
            existingId: z.uuid().nullable(),
            title: z.string().max(500),
            nextAction: z.string().max(500),
            suggestedMinutes: z.number().int().min(1).max(120),
            minutesText: z.string().max(10).optional(),
          })
          .strict(),
      )
      .max(20),
  })
  .strict();
export type CreationDraft = z.infer<typeof draftSchema>;
export function meaningfulDraft(d: CreationDraft | null): boolean {
  return !!d && ([d.description, d.alreadyDone, d.stuck, d.constraints,
    d.clarification, d.goal, d.finishCondition].some((value) => value.trim()) ||
    d.steps.some((step) => step.title.trim() || step.nextAction.trim() ||
      step.suggestedMinutes !== 20 || step.minutesText !== undefined));
}
export function distinctInstruction(title: string, instruction: string): boolean {
  const normalize = (value: string) => value.trim().replace(/\s+/g, " ").toLowerCase();
  return !!normalize(instruction) && normalize(title) !== normalize(instruction);
}
export function newDraft(): CreationDraft {
  return {
    id: crypto.randomUUID(),
    editingMountainId: null,
    description: "",
    alreadyDone: "",
    stuck: "",
    constraints: "",
    clarification: "",
    goal: "",
    finishCondition: "",
    steps: [],
  };
}
export function combinedDescription(d: CreationDraft) {
  return [
    d.description,
    d.alreadyDone && `Already done (user reported): ${d.alreadyDone}`,
    d.stuck && `Where I am stuck: ${d.stuck}`,
    d.constraints && `Constraints: ${d.constraints}`,
  ]
    .filter(Boolean)
    .join("\n\n");
}
// One active request per editor. Edits, cancellation and unmount invalidate late replies.
export class RequestGate {
  private generation = 0;
  private controller: AbortController | null = null;
  begin() {
    this.cancel();
    this.controller = new AbortController();
    return { id: this.generation, signal: this.controller.signal };
  }
  current(id: number) {
    return id === this.generation && !this.controller?.signal.aborted;
  }
  cancel() {
    this.generation++;
    this.controller?.abort();
    this.controller = null;
  }
}

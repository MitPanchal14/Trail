import { z } from "zod";
import { draftSchema } from "./planning";

const id = z.uuid();
const time = z.iso.datetime();
const nullableTime = time.nullable();
const text = z.string().trim().min(1).max(500);
const ms = z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER);
export const durationSchema = z.number().int().min(1).max(120);
const zone = z.string().refine((value) => {
  try {
    new Intl.DateTimeFormat("en", { timeZone: value });
    return true;
  } catch {
    return false;
  }
}, "Invalid time zone");
const mountainSchema = z
  .object({
    id,
    title: text,
    description: z.string().max(6000),
    finishCondition: text,
    terrainSeed: id,
    nextCheckpointSlot: z.number().int().nonnegative(),
    status: z.enum(["active", "completed", "reopened"]),
    createdAt: time,
    savedSubtaskId: id.nullable(),
    savedAt: nullableTime,
  })
  .strict();
const subtaskSchema = z
  .object({
    id,
    mountainId: id,
    title: text,
    nextAction: text,
    suggestedMinutes: durationSchema,
    orderKey: z.number(),
    checkpointSlot: z.number().int().nonnegative(),
    archivedAt: nullableTime,
  })
  .strict();
const sessionSchema = z
  .object({
    id,
    subtaskId: id,
    status: z.enum([
      "running",
      "paused",
      "saved",
      "interrupted",
      "expired",
      "completed",
    ]),
    startedAt: time,
    lastHeartbeatAt: time,
    remainingMs: ms,
    creditedMs: ms,
    runningDeadlineAt: nullableTime,
    lastAccountedAt: time,
    note: z.string().max(2000),
    returnStep: z.string().max(500).default(""),
    dailyElapsed: z.record(z.string().regex(/^\d{4}-\d{2}-\d{2}$/), ms),
  })
  .strict();
const completionSchema = z
  .object({
    id,
    subtaskId: id,
    completedAt: time,
    localDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    calendarTimeZone: zone,
    note: z.string().max(2000),
    sessionIds: z.array(id),
    undoneAt: nullableTime,
  })
  .strict();
const summitSchema = z.object({
  id, mountainId: id, confirmedAt: time,
  relatedCompletionIds: z.array(id).min(1).max(10000), revokedAt: nullableTime,
}).strict();
export const snapshotSchema = z
  .object({
    schemaVersion: z.literal(1),
    revision: ms,
    firstUseAt: time,
    calendarTimeZone: zone,
    mountains: z.array(mountainSchema).max(500),
    subtasks: z.array(subtaskSchema).max(10000),
    sessions: z.array(sessionSchema).max(10000),
    completions: z.array(completionSchema).max(10000),
    summitConfirmations: z.array(summitSchema).max(10000),
    dayPlans: z
      .array(
        z
          .object({
            dateKey: z.iso.date(),
            availabilityText: z.string().max(1000),
            availableMinutes: z
              .number()
              .int()
              .min(1)
              .max(1440)
              .nullable()
              .optional(),
            draftSubtaskIds: z.array(id).max(50),
            committedAt: nullableTime,
            commitments: z
              .array(
                z
                  .object({
                    id,
                    subtaskId: id,
                    titleSnapshot: text,
                    committedAt: time,
                    disposition: z.enum(["planned", "removed", "deferred"]),
                    dispositionAt: nullableTime,
                  })
                  .strict(),
              )
              .max(10000),
          })
          .strict(),
      )
      .max(3660),
    creationDraft: draftSchema.nullable(),
    selection: z
      .object({
        selectedMountainId: id.nullable(),
        selectedSubtaskId: id.nullable(),
        sessionId: id.nullable(),
      })
      .strict(),
  })
  .strict()
  .superRefine((s, ctx) => {
    const fail = (message: string) => ctx.addIssue({ code: "custom", message });
    for (const items of [s.mountains, s.subtasks, s.sessions, s.completions, s.summitConfirmations])
      if (new Set(items.map((x) => x.id)).size !== items.length)
        fail("Duplicate IDs");
    const mountains = new Map(s.mountains.map((x) => [x.id, x])),
      tasks = new Map(s.subtasks.map((x) => [x.id, x])),
      sessions = new Map(s.sessions.map((x) => [x.id, x]));
    const slots = new Set<string>(),
      active = new Set<string>();
    for (const summit of s.summitConfirmations) {
      if (!mountains.has(summit.mountainId) || new Set(summit.relatedCompletionIds).size !== summit.relatedCompletionIds.length ||
        summit.relatedCompletionIds.some(id => {
          const c = s.completions.find(c => c.id === id);
          return !c || tasks.get(c.subtaskId)?.mountainId !== summit.mountainId;
        }) || (summit.revokedAt && summit.revokedAt < summit.confirmedAt)) fail("Invalid summit history");
    }
    for (const m of s.mountains) {
      if (m.status === "completed" && !s.summitConfirmations.some(c => c.mountainId === m.id && !c.revokedAt)) fail("Completed mountain requires a summit confirmation");
    }
    if (new Set(s.dayPlans.map((p) => p.dateKey)).size !== s.dayPlans.length)
      fail("Duplicate day plans");
    for (const plan of s.dayPlans) {
      if (
        new Set(plan.draftSubtaskIds).size !== plan.draftSubtaskIds.length ||
        plan.draftSubtaskIds.some((id) => !tasks.has(id))
      )
        fail("Invalid draft selection");
      if (
        new Set(plan.commitments.map((c) => c.id)).size !==
          plan.commitments.length ||
        new Set(plan.commitments.map((c) => c.subtaskId)).size !==
          plan.commitments.length ||
        plan.commitments.some((c) => !tasks.has(c.subtaskId))
      )
        fail("Invalid commitments");
    }
    if (
      s.creationDraft?.editingMountainId &&
      !mountains.has(s.creationDraft.editingMountainId)
    )
      fail("Invalid editing mountain");
    for (const step of s.creationDraft?.steps ?? [])
      if (
        step.existingId &&
        tasks.get(step.existingId)?.mountainId !==
          s.creationDraft?.editingMountainId
      )
        fail("Invalid draft action");
    for (const t of s.subtasks) {
      const m = mountains.get(t.mountainId),
        key = `${t.mountainId}:${t.checkpointSlot}`;
      if (!m || t.checkpointSlot >= m.nextCheckpointSlot || slots.has(key))
        fail("Invalid checkpoint mapping");
      slots.add(key);
    }
    for (const m of s.mountains)
      if (m.savedSubtaskId && tasks.get(m.savedSubtaskId)?.mountainId !== m.id)
        fail("Invalid saved action");
    for (const session of s.sessions) {
      if (
        !tasks.has(session.subtaskId) ||
        session.remainingMs > 7200000 ||
        Object.values(session.dailyElapsed).reduce((a, b) => a + b, 0) !==
          session.creditedMs
      )
        fail("Invalid session");
      if (
        Object.keys(session.dailyElapsed).some(
          (key) => !z.iso.date().safeParse(key).success,
        )
      )
        fail("Invalid session date");
      if (
        session.status === "running" &&
        (!session.runningDeadlineAt || session.remainingMs === 0)
      )
        fail("Invalid running commitment");
    }
    for (const c of s.completions) {
      if (
        !tasks.has(c.subtaskId) ||
        c.sessionIds.some((id) => sessions.get(id)?.subtaskId !== c.subtaskId)
      )
        fail("Invalid completion references");
      try {
        if (
          c.localDate !== dateKey(Date.parse(c.completedAt), c.calendarTimeZone)
        )
          fail("Invalid completion date");
      } catch {
        fail("Invalid completion time zone");
      }
      if (new Set(c.sessionIds).size !== c.sessionIds.length)
        fail("Duplicate session credit");
      if (!c.undoneAt) {
        if (active.has(c.subtaskId)) fail("Duplicate active completion");
        active.add(c.subtaskId);
      }
    }
    if (
      s.sessions.filter((x) => x.status === "running" || x.status === "paused")
        .length > 1
    )
      fail("Multiple running sessions");
    if (
      s.sessions.some(
        (x) =>
          ["running", "paused"].includes(x.status) && active.has(x.subtaskId),
      )
    )
      fail("Completed work cannot be timing");
    const selected = tasks.get(s.selection.selectedSubtaskId ?? "");
    if (
      s.selection.selectedMountainId &&
      !mountains.has(s.selection.selectedMountainId)
    )
      fail("Invalid selected mountain");
    if (
      s.selection.selectedSubtaskId &&
      (!selected || selected.mountainId !== s.selection.selectedMountainId)
    )
      fail("Invalid selected action");
    if (
      s.selection.sessionId &&
      sessions.get(s.selection.sessionId)?.subtaskId !==
        s.selection.selectedSubtaskId
    )
      fail("Invalid selected session");
    for (const x of s.sessions)
      if (x.status === "running" && x.id !== s.selection.sessionId)
        fail("Unselected running session");
  });
export type Snapshot = z.infer<typeof snapshotSchema>;
export type Session = Snapshot["sessions"][number];
export function emptySnapshot(now = Date.now()): Snapshot {
  return {
    schemaVersion: 1,
    revision: 0,
    firstUseAt: new Date(now).toISOString(),
    calendarTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    mountains: [],
    subtasks: [],
    sessions: [],
    completions: [],
    summitConfirmations: [],
    dayPlans: [],
    creationDraft: null,
    selection: {
      selectedMountainId: null,
      selectedSubtaskId: null,
      sessionId: null,
    },
  };
}
export function dateKey(now: number, timeZone: string) {
  const p = new Intl.DateTimeFormat("en", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  return `${p.find((x) => x.type === "year")!.value}-${p.find((x) => x.type === "month")!.value}-${p.find((x) => x.type === "day")!.value}`;
}
export const currentSession = (s: Snapshot) =>
  s.sessions.find((x) => x.id === s.selection.sessionId);
export const activeCompletion = (s: Snapshot, taskId: string) =>
  s.completions.find((x) => x.subtaskId === taskId && !x.undoneAt);

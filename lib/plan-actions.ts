import {
  activeCompletion,
  currentSession,
  dateKey,
  type Snapshot,
} from "./domain";
import { breakdownSchema, draftSchema, type CreationDraft } from "./planning";
export type PlanningAction =
  | { type: "draft"; draft: CreationDraft | null }
  | { type: "accept"; draftId: string }
  | {
      type: "day-draft";
      date: string;
      availability: string;
      minutes: number | null;
      ids: string[];
    }
  | { type: "day-commit"; date: string }
  | {
      type: "disposition";
      date: string;
      id: string;
      disposition: "removed" | "deferred";
    };
export function applyPlanning(
  s: Snapshot,
  action: PlanningAction,
  now: number,
) {
  const stamp = new Date(now).toISOString(),
    session = currentSession(s);
  if (action.type === "draft") {
    s.creationDraft =
      action.draft === null ? null : draftSchema.parse(action.draft);
    return;
  }
  if (["running", "paused"].includes(session?.status ?? ""))
    throw Error(
      "Save your place before changing accepted work or today’s plan.",
    );
  if (action.type === "accept") {
    const d = s.creationDraft;
    if (!d || d.id !== action.draftId) return;
    const reviewed = breakdownSchema.parse({
      kind: "breakdown",
      goal: d.goal,
      finishCondition: d.finishCondition,
      steps: d.steps.map(({ title, nextAction, suggestedMinutes, minutesText }) => ({
        title,
        nextAction,
        suggestedMinutes: minutesText === undefined ? suggestedMinutes : Number(minutesText),
      })),
    });
    if (
      new Set(d.steps.map((x) => x.key)).size !== d.steps.length ||
      new Set(d.steps.filter((x) => x.existingId).map((x) => x.existingId))
        .size !== d.steps.filter((x) => x.existingId).length
    )
      throw Error("Duplicate draft actions");
    let mountain = s.mountains.find((m) => m.id === d.editingMountainId);
    if (!mountain) {
      const id = crypto.randomUUID();
      mountain = {
        id,
        title: reviewed.goal,
        description: d.description,
        finishCondition: reviewed.finishCondition,
        terrainSeed: id,
        nextCheckpointSlot: 0,
        status: "active",
        createdAt: stamp,
        savedSubtaskId: null,
        savedAt: null,
      };
      s.mountains.push(mountain);
    }
    mountain.title = reviewed.goal;
    mountain.finishCondition = reviewed.finishCondition;
    mountain.description = d.description;
    const retained = new Set(d.steps.map((x) => x.existingId));
    for (const task of s.subtasks.filter(
      (t) =>
        t.mountainId === mountain.id && !t.archivedAt && !retained.has(t.id),
    )) {
      task.archivedAt = stamp;
      for (const plan of s.dayPlans) {
        plan.draftSubtaskIds = plan.draftSubtaskIds.filter(
          (id) => id !== task.id,
        );
        for (const c of plan.commitments)
          if (c.subtaskId === task.id && c.disposition === "planned") {
            c.disposition = "removed";
            c.dispositionAt = stamp;
          }
      }
    }
    d.steps.forEach((step, index) => {
      const existing = s.subtasks.find(
        (t) => t.id === step.existingId && t.mountainId === mountain.id,
      );
      if (step.existingId && !existing) throw Error("Unknown existing action");
      if (existing) {
        Object.assign(existing, reviewed.steps[index], {
          orderKey: index,
          archivedAt: null,
        });
      } else {
        s.subtasks.push({
          id: crypto.randomUUID(),
          mountainId: mountain.id,
          ...reviewed.steps[index],
          orderKey: index,
          checkpointSlot: mountain.nextCheckpointSlot++,
          archivedAt: null,
        });
      }
    });
    if (!d.editingMountainId) {
      const first = s.subtasks.find(
        (t) => t.mountainId === mountain.id && !t.archivedAt,
      )!;
      s.selection = {
        selectedMountainId: mountain.id,
        selectedSubtaskId: first.id,
        sessionId: null,
      };
    }
    if (
      s.subtasks.find((t) => t.id === s.selection.selectedSubtaskId)?.archivedAt
    ) {
      const first = s.subtasks.find(
        (t) => t.mountainId === mountain.id && !t.archivedAt,
      );
      s.selection = {
        selectedMountainId: first?.mountainId ?? null,
        selectedSubtaskId: first?.id ?? null,
        sessionId: first
          ? (s.sessions.findLast((x) => x.subtaskId === first.id)?.id ?? null)
          : null,
      };
    }
    s.creationDraft = null;
    return;
  }
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(action.date) ||
    action.date !== dateKey(now, s.calendarTimeZone)
  )
    throw Error("Today changed. Reload the planner before editing.");
  let plan = s.dayPlans.find((p) => p.dateKey === action.date);
  if (action.type === "day-draft") {
    if (
      action.ids.length > 50 ||
      new Set(action.ids).size !== action.ids.length ||
      action.ids.some(
        (id) =>
          !s.subtasks.some((t) => t.id === id && !t.archivedAt) ||
          activeCompletion(s, id),
      )
    )
      throw Error("Choose known unfinished actions only.");
    if (
      action.availability.length > 1000 ||
      (action.minutes !== null &&
        (!Number.isInteger(action.minutes) ||
          action.minutes < 1 ||
          action.minutes > 1440))
    )
      throw Error("Check availability and minutes.");
    if (!plan) {
      plan = {
        dateKey: action.date,
        availabilityText: "",
        availableMinutes: null,
        draftSubtaskIds: [],
        committedAt: null,
        commitments: [],
      };
      s.dayPlans.push(plan);
    }
    plan.availabilityText = action.availability;
    plan.availableMinutes = action.minutes;
    plan.draftSubtaskIds = action.ids;
    return;
  }
  if (!plan) return;
  if (action.type === "day-commit") {
    const selected = new Set(plan.draftSubtaskIds);
    for (const c of plan.commitments)
      if (
        c.disposition === "planned" &&
        !selected.has(c.subtaskId) &&
        !activeCompletion(s, c.subtaskId)
      ) {
        c.disposition = "removed";
        c.dispositionAt = stamp;
      }
    for (const id of selected) {
      const task = s.subtasks.find((t) => t.id === id && !t.archivedAt);
      if (!task || activeCompletion(s, id)) continue;
      const prior = plan.commitments.find((c) => c.subtaskId === id);
      if (prior) {
        prior.disposition = "planned";
        prior.dispositionAt = stamp;
      } else
        plan.commitments.push({
          id: crypto.randomUUID(),
          subtaskId: id,
          titleSnapshot: task.title,
          committedAt: stamp,
          disposition: "planned",
          dispositionAt: null,
        });
    }
    plan.committedAt ??= stamp;
    plan.commitments = [
      ...plan.draftSubtaskIds
        .map((id) => plan!.commitments.find((c) => c.subtaskId === id))
        .filter((c): c is NonNullable<typeof c> => !!c),
      ...plan.commitments.filter((c) => !selected.has(c.subtaskId)),
    ];
    const saved = s.sessions
      .filter(
        (x) =>
          ["saved", "interrupted"].includes(x.status) &&
          !activeCompletion(s, x.subtaskId) &&
          s.subtasks.some((t) => t.id === x.subtaskId && !t.archivedAt),
      )
      .sort((a, b) => {
        const savedAt = (x: typeof a) =>
          s.mountains.find((m) => m.savedSubtaskId === x.subtaskId)?.savedAt ??
          x.lastHeartbeatAt;
        return Date.parse(savedAt(b)) - Date.parse(savedAt(a));
      })[0];
    if (saved) {
      const task = s.subtasks.find((t) => t.id === saved.subtaskId)!;
      s.selection = {
        selectedMountainId: task.mountainId,
        selectedSubtaskId: task.id,
        sessionId: saved.id,
      };
    } else {
      const id = plan.draftSubtaskIds.find((id) => !activeCompletion(s, id));
      const t = s.subtasks.find((t) => t.id === id);
      if (t)
        s.selection = {
          selectedMountainId: t.mountainId,
          selectedSubtaskId: t.id,
          sessionId:
            s.sessions.findLast((x) => x.subtaskId === t.id)?.id ?? null,
        };
    }
  } else {
    const c = plan.commitments.find((c) => c.id === action.id);
    if (c) {
      c.disposition = action.disposition;
      c.dispositionAt = stamp;
      plan.draftSubtaskIds = plan.draftSubtaskIds.filter(
        (id) => id !== c.subtaskId,
      );
    }
  }
}

import {
  activeCompletion,
  currentSession,
  dateKey,
  durationSchema,
  returnContextSchema,
  type Snapshot,
} from "./domain";
import { account, recover, resume } from "./timer";
import { applyPlanning, type PlanningAction } from "./plan-actions";
import { applySummit, type SummitAction } from "./summit";
export type Action =
  | SummitAction
  | PlanningAction
  | {
      type: "create";
      title: string;
      finishCondition: string;
      action: string;
      minutes: number;
    }
  | { type: "select"; id: string }
  | { type: "start"; minutes: number }
  | { type: "start-next"; id: string; minutes: number }
  | { type: "edit-draft"; draft: NonNullable<Snapshot["creationDraft"]> }
  | { type: "tick" | "pause" | "resume" | "save" | "complete" | "interrupt" }
  | { type: "note"; note: string }
  | { type: "return-step"; value: string }
  | { type: "update-progress"; id: string; note: string; returnStep: string; expectedRevision: number }
  | { type: "extend"; minutes: number }
  | { type: "undo"; id: string; correctSummit?: boolean };
export function transition(
  previous: Snapshot,
  action: Action,
  now = Date.now(),
): Snapshot {
  if (action.type === "update-progress") {
    const target = previous.subtasks.find(t => t.id === action.id);
    if (previous.revision !== action.expectedRevision || previous.selection.selectedSubtaskId !== action.id ||
      !target || target.archivedAt || activeCompletion(previous, target.id) ||
      previous.sessions.some(x => ["running", "paused"].includes(x.status))) return previous;
    const context = returnContextSchema.parse({ note: action.note, returnStep: action.returnStep });
    // Context capture is not a timing event: do not account, create or mutate sessions.
    const next = structuredClone(previous);
    next.subtasks.find(t => t.id === target.id)!.returnContext = context;
    const mountain = next.mountains.find(m => m.id === target.mountainId)!;
    mountain.savedSubtaskId = target.id;
    mountain.savedAt = new Date(now).toISOString();
    next.revision++;
    return next;
  }
  if (action.type === "edit-draft") return transition(previous, { type: "draft", draft: action.draft }, now);
  if (action.type === "start-next") {
    const target = previous.subtasks.find((t) => t.id === action.id);
    if (!target || target.archivedAt || activeCompletion(previous, target.id) ||
      previous.sessions.some((x) => ["running", "paused"].includes(x.status))) return previous;
    durationSchema.parse(action.minutes);
    const selected = transition(previous, { type: "select", id: target.id }, now);
    const started = transition(selected, { type: "start", minutes: action.minutes }, now);
    return currentSession(started)?.status === "running" ? started : previous;
  }
  const s = structuredClone(previous),
    stamp = new Date(now).toISOString();
  let session = currentSession(s);
  if (session && action.type !== "interrupt") {
    const accounted = account(session, now, s.calendarTimeZone);
    Object.assign(session, accounted);
  }
  const task = s.subtasks.find((x) => x.id === s.selection.selectedSubtaskId);
  const takeReturnContext = () => {
    if (task?.returnContext && session) {
      Object.assign(session, task.returnContext);
      delete task.returnContext;
    }
  };
  switch (action.type) {
    case "confirm-summit":
    case "reopen-goal":
    case "correct-summit":
      applySummit(s, action, now);
      break;
    case "draft":
    case "accept":
    case "day-draft":
    case "day-commit":
    case "disposition":
      applyPlanning(s, action, now);
      break;
    case "create": {
      if (session && ["running", "paused"].includes(session.status))
        return previous;
      const minutes = durationSchema.parse(action.minutes),
        title = action.title.trim(),
        finish = action.finishCondition.trim(),
        next = action.action.trim();
      if (
        !title ||
        !finish ||
        !next ||
        Math.max(title.length, finish.length, next.length) > 500
      )
        throw Error("Use 1–500 characters in each field.");
      const mountainId = crypto.randomUUID(),
        id = crypto.randomUUID();
      s.mountains.push({
        id: mountainId,
        title,
        description: "",
        finishCondition: finish,
        terrainSeed: mountainId,
        nextCheckpointSlot: 1,
        status: "active",
        createdAt: stamp,
        savedSubtaskId: null,
        savedAt: null,
      });
      s.subtasks.push({
        id,
        mountainId,
        title: next,
        nextAction: next,
        suggestedMinutes: minutes,
        orderKey: 0,
        checkpointSlot: 0,
        archivedAt: null,
      });
      s.selection = {
        selectedMountainId: mountainId,
        selectedSubtaskId: id,
        sessionId: null,
      };
      break;
    }
    case "select": {
      if (session && ["running", "paused"].includes(session.status))
        return previous;
      const selected = s.subtasks.find((x) => x.id === action.id);
      if (!selected || selected.archivedAt) return previous;
      s.selection = {
        selectedMountainId: selected.mountainId,
        selectedSubtaskId: selected.id,
        sessionId:
          s.sessions.findLast((x) => x.subtaskId === selected.id)?.id ?? null,
      };
      break;
    }
    case "start":
      if (!task || task.archivedAt || activeCompletion(s, task.id))
        return previous;
      if (session && session.status !== "completed") {
        takeReturnContext();
        Object.assign(session, resume(session, now));
        break;
      }
      task.suggestedMinutes = durationSchema.parse(action.minutes);
      session = {
        id: crypto.randomUUID(),
        subtaskId: task.id,
        status: "running",
        startedAt: stamp,
        lastHeartbeatAt: stamp,
        remainingMs: task.suggestedMinutes * 60000,
        creditedMs: 0,
        runningDeadlineAt: new Date(
          now + task.suggestedMinutes * 60000,
        ).toISOString(),
        lastAccountedAt: stamp,
        note: "",
        returnStep: "",
        dailyElapsed: {},
      };
      takeReturnContext();
      s.sessions.push(session);
      s.selection.sessionId = session.id;
      break;
    case "resume":
      if (
        session &&
        session.status !== "completed" &&
        task &&
        !activeCompletion(s, task.id)
      ) {
        takeReturnContext();
        Object.assign(session, resume(session, now));
      }
      break;
    case "pause":
      if (session && session.status === "running") {
        session.status = "paused";
        session.runningDeadlineAt = null;
      }
      break;
    case "interrupt":
      if (session) Object.assign(session, recover(session));
      break;
    case "save":
      if (session && session.status !== "completed") {
        session.status = "saved";
        session.runningDeadlineAt = null;
        const mountain = s.mountains.find((x) => x.id === task?.mountainId);
        if (mountain) {
          mountain.savedAt = stamp;
          mountain.savedSubtaskId = task!.id;
        }
      }
      break;
    case "note":
      if (session && session.status !== "completed")
        session.note = action.note.slice(0, 2000);
      break;
    case "return-step":
      if (session && session.status !== "completed")
        session.returnStep = action.value.slice(0, 500);
      break;
    case "extend":
      if (session && session.status !== "completed") {
        const minutes = durationSchema.parse(action.minutes);
        if (session.remainingMs + minutes * 60000 > 7200000)
          throw Error("Remaining commitment cannot exceed 120 minutes.");
        session.remainingMs += minutes * 60000;
        takeReturnContext();
        Object.assign(session, resume(session, now));
      }
      break;
    case "complete":
      if (task && !activeCompletion(s, task.id)) {
        for (const plan of s.dayPlans)
          plan.draftSubtaskIds = plan.draftSubtaskIds.filter(
            (id) => id !== task.id,
          );
        if (session) {
          session.status = "completed";
          session.runningDeadlineAt = null;
        }
        s.completions.push({
          id: crypto.randomUUID(),
          subtaskId: task.id,
          completedAt: stamp,
          localDate: dateKey(now, s.calendarTimeZone),
          calendarTimeZone: s.calendarTimeZone,
          note: task.returnContext?.note ?? session?.note ?? "",
          sessionIds: s.sessions
            .filter((x) => x.subtaskId === task.id)
            .map((x) => x.id),
          undoneAt: null,
        });
      }
      break;
    case "undo": {
      const completion = s.completions.find((x) => x.id === action.id);
      if (completion && !completion.undoneAt) {
        const linked = s.summitConfirmations.filter(c => !c.revokedAt && c.relatedCompletionIds.includes(completion.id));
        if (linked.length && action.correctSummit === undefined) throw Error("Choose whether the linked summit confirmation was also mistaken.");
        if (action.correctSummit) for (const c of linked) applySummit(s, { type: "correct-summit", id: c.id }, now);
        completion.undoneAt = stamp;
        const restored = s.sessions.findLast((x) => x.subtaskId === completion.subtaskId);
        if (restored?.status === "completed") {
          restored.status = "saved";
          restored.runningDeadlineAt = null;
        }
      }
      break;
    }
    case "tick":
      break;
  }
  s.revision++;
  return s;
}
export function recoverSnapshot(s: Snapshot, now = Date.now()): Snapshot {
  const sessions = s.sessions.map(recover);
  const candidates = sessions.filter(
    (x) =>
      ["saved", "interrupted"].includes(x.status) &&
      s.subtasks.some((t) => t.id === x.subtaskId && !t.archivedAt) &&
      !activeCompletion(s, x.subtaskId),
  );
  const savedTime = (session: (typeof sessions)[number]) =>
    s.mountains.find((m) => m.savedSubtaskId === session.subtaskId)?.savedAt ??
    session.lastHeartbeatAt;
  const latest = candidates.sort(
    (a, b) => Date.parse(savedTime(b)) - Date.parse(savedTime(a)),
  )[0];
  const today = s.dayPlans.find(
    (p) => p.dateKey === dateKey(now, s.calendarTimeZone),
  );
  const planned = today?.commitments.find(
    (c) =>
      c.disposition === "planned" &&
      !activeCompletion(s, c.subtaskId) &&
      s.subtasks.some((t) => t.id === c.subtaskId && !t.archivedAt),
  )?.subtaskId;
  const contextTask = s.subtasks.filter(t => t.returnContext && !t.archivedAt && !activeCompletion(s, t.id) &&
    s.mountains.some(m => m.savedSubtaskId === t.id && m.savedAt))
    .sort((a, b) => Date.parse(s.mountains.find(m => m.id === b.mountainId)!.savedAt!) - Date.parse(s.mountains.find(m => m.id === a.mountainId)!.savedAt!))[0];
  const contextWins = contextTask && (!latest || Date.parse(s.mountains.find(m => m.id === contextTask.mountainId)!.savedAt!) >= Date.parse(savedTime(latest)));
  const task = s.subtasks.find((t) => t.id === (contextWins ? contextTask.id : latest?.subtaskId ?? planned));
  return {
    ...s,
    sessions,
    selection: task
      ? {
          selectedMountainId: task.mountainId,
          selectedSubtaskId: task.id,
          sessionId:
            (contextWins ? undefined : latest?.id) ??
            sessions.findLast((x) => x.subtaskId === task.id)?.id ??
            null,
        }
      : s.selection,
  };
}

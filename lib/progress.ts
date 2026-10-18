import { dateKey, type Snapshot } from "./domain";

// UTC is a calendar arithmetic carrier only. Instants use the persisted zone;
// completion.localDate and session.dailyElapsed keys are never re-bucketed.
export function shiftDate(date: string, days: number) {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
export function yearDates(year: number) {
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const first = `${String(year).padStart(4, "0")}-01-01`;
  return Array.from({ length: leap ? 366 : 365 }, (_, i) => shiftDate(first, i));
}
export const completionBand = (count: number) => count === 0 ? 0 : count === 1 ? 1 : count <= 3 ? 2 : count <= 5 ? 3 : 4;
export function formatRecordedTime(ms: number) {
  if (!ms) return "0s";
  if (ms < 1000) return "<1s";
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  return minutes < 60 ? `${minutes}m ${seconds % 60}s` : `${Math.floor(minutes / 60)}h ${minutes % 60}m ${seconds % 60}s`;
}
export function displayDate(date: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${date}T12:00:00Z`));
}
export function comparisonPeriods(s: Snapshot, now = Date.now()) {
  const today = dateKey(now, s.calendarTimeZone);
  const recent = { start: shiftDate(today, -7), end: shiftDate(today, -1) };
  const previous = { start: shiftDate(today, -14), end: shiftDate(today, -8) };
  // The first-use date is partial; don't claim two full periods cover it.
  return { recent, previous, sufficient: dateKey(Date.parse(s.firstUseAt), s.calendarTimeZone) < previous.start };
}

export function progressProjection(s: Snapshot, now = Date.now()) {
  const today = dateKey(now, s.calendarTimeZone);
  const firstUse = dateKey(Date.parse(s.firstUseAt), s.calendarTimeZone);
  const tasks = new Map(s.subtasks.map(t => [t.id, t]));
  const mountains = new Map(s.mountains.map(m => [m.id, m]));
  const completions = new Map<string, Snapshot["completions"]>();
  const activeByTask = new Map<string, Snapshot["completions"][number]>();
  for (const c of s.completions) if (!c.undoneAt) {
    const list = completions.get(c.localDate) ?? [];
    list.push(c);
    completions.set(c.localDate, list);
    activeByTask.set(c.subtaskId, c);
  }
  const sessions = new Map<string, { session: Snapshot["sessions"][number]; ms: number }[]>();
  for (const session of s.sessions) for (const [date, ms] of Object.entries(session.dailyElapsed)) if (ms > 0) {
    const list = sessions.get(date) ?? [];
    list.push({ session, ms });
    sessions.set(date, list);
  }
  const plans = new Map(s.dayPlans.map(p => [p.dateKey, p]));
  const saves = new Map<string, { mountain: Snapshot["mountains"][number]; session: Snapshot["sessions"][number] | undefined }[]>();
  for (const mountain of s.mountains) if (mountain.savedAt && mountain.savedSubtaskId) {
    const date = dateKey(Date.parse(mountain.savedAt), s.calendarTimeZone);
    const list = saves.get(date) ?? [];
    list.push({ mountain, session: s.sessions.findLast(x => x.subtaskId === mountain.savedSubtaskId) });
    saves.set(date, list);
  }
  const day = (date: string) => {
    const completed = completions.get(date) ?? [];
    const commitments = (plans.get(date)?.commitments ?? []).map(record => {
      const completion = activeByTask.get(record.subtaskId);
      const completedOnDate = !!completion && completion.localDate === date && Date.parse(completion.completedAt) >= Date.parse(record.committedAt);
      return { record, completion, completedOnDate };
    });
    const committedCompleted = commitments.filter(c => c.completedOnDate).length;
    const committedIds = new Set(commitments.map(c => c.record.subtaskId));
    const planComplete = commitments.length > 0 && committedCompleted === commitments.length;
    const dateSessions = sessions.get(date) ?? [];
    return {
      date, count: completed.length, completed, commitments, committedCompleted, planComplete,
      unplanned: completed.filter(c => !committedIds.has(c.subtaskId)),
      sessions: dateSessions, recordedMs: dateSessions.reduce((sum, x) => sum + x.ms, 0),
      saves: saves.get(date) ?? [],
      state: date > today ? "future" : date < firstUse ? "before-first-use" : "recorded-period",
    };
  };
  const totals = (start: string, end: string) => {
    let count = 0, days = 0, recordedMs = 0;
    for (const [date, list] of completions) if (date >= start && date <= end) { count += list.length; days++; }
    for (const [date, list] of sessions) if (date >= start && date <= end) recordedMs += list.reduce((sum, x) => sum + x.ms, 0);
    return { completions: count, days, recordedMs };
  };
  const recordedDates = [firstUse, ...s.completions.map(c => c.localDate), ...s.dayPlans.filter(p => p.commitments.length).map(p => p.dateKey), ...sessions.keys(), ...saves.keys()];
  const years = [...new Set([Number(today.slice(0,4)), ...recordedDates.map(d => Number(d.slice(0,4)))])].filter(y => y <= Number(today.slice(0,4))).sort((a,b) => b-a);
  return { today, firstUse, day, totals, years, tasks, mountains };
}

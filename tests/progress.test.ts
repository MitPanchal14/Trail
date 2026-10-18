import { describe, it, expect } from "vitest";
import { emptySnapshot, snapshotSchema, dateKey } from "../lib/domain";
import { transition } from "../lib/actions";
import { yearDates, shiftDate, completionBand, progressProjection, comparisonPeriods, formatRecordedTime } from "../lib/progress";
const at = (d: string) => Date.parse(d);
const create = (s = emptySnapshot(at("2024-01-01T00:00:00Z")), now = at("2024-03-01T10:00:00Z")) => transition(s, { type: "create", title: "Fictional guide", finishCondition: "Reviewed", action: "Draw leaf", minutes: 5 }, now);

describe("calendar-based progress", () => {
  it("renders real dates including leap centuries, calendar shifts across DST and fixed bands", () => {
    expect(yearDates(2024)).toHaveLength(366);
    expect(yearDates(2026)).toHaveLength(365);
    expect(yearDates(2000)).toHaveLength(366);
    expect(yearDates(1900)).toHaveLength(365);
    expect(new Set(yearDates(2024)).size).toBe(366);
    expect(yearDates(2024)).toContain("2024-02-29");
    expect(shiftDate("2024-03-10", 1)).toBe("2024-03-11");
    expect(shiftDate("2024-11-03", -1)).toBe("2024-11-02");
    expect(shiftDate("2024-01-01", -1)).toBe("2023-12-31");
    expect([0,1,2,3,4,5,6,20].map(completionBand)).toEqual([0,1,2,2,3,3,4,4]);
  });
  it("distinguishes first use, today, future and quiet history in the persisted zone", () => {
    const s = emptySnapshot(at("2024-03-01T01:00:00Z"));
    s.calendarTimeZone = "America/Los_Angeles";
    const p = progressProjection(s, at("2024-03-02T01:00:00Z"));
    expect(p.today).toBe("2024-03-01");
    expect(p.firstUse).toBe("2024-02-29");
    expect(p.day("2024-02-28").state).toBe("before-first-use");
    expect(p.day("2024-02-29").state).toBe("recorded-period");
    expect(p.day("2024-03-02").state).toBe("future");
    expect(p.day(p.today).count).toBe(0);
  });
  it("counts archived completions once on recorded dates; Undo and recompletion move actual credit", () => {
    let s = create();
    s = transition(s, { type: "complete" }, at("2024-03-01T10:01:00Z"));
    s.subtasks[0].archivedAt = "2024-03-03T00:00:00Z";
    expect(progressProjection(s).day("2024-03-01").count).toBe(1);
    s = transition(s, { type: "undo", id: s.completions[0].id }, at("2024-03-03T10:00:00Z"));
    expect(progressProjection(s).day("2024-03-01").count).toBe(0);
    s.subtasks[0].archivedAt = null;
    s = transition(s, { type: "complete" }, at("2024-03-03T10:01:00Z"));
    s = transition(s, { type: "complete" }, at("2024-03-03T10:02:00Z"));
    const p = progressProjection(s);
    expect(p.day("2024-03-01").count).toBe(0);
    expect(p.day("2024-03-03").count).toBe(1);
    expect(p.totals("2024-01-01", "2024-12-31")).toMatchObject({ completions: 1, days: 1, recordedMs: 0 });
  });
  it("requires a nonempty historical commitment set and same-date completion after commitment", () => {
    let s = create();
    const id = s.subtasks[0].id;
    const draftTime = at("2024-03-01T10:00:00Z");
    s = transition(s, { type: "day-draft", date: "2024-03-01", ids: [id], availability: "", minutes: null }, draftTime);
    expect(progressProjection(s).day("2024-03-01").planComplete).toBe(false);
    expect(progressProjection(s).day("2024-03-01").commitments).toHaveLength(0);
    s = transition(s, { type: "day-commit", date: "2024-03-01" }, draftTime);
    s = transition(s, { type: "complete" }, draftTime + 1000);
    expect(progressProjection(s).day("2024-03-01")).toMatchObject({ planComplete: true, committedCompleted: 1 });
    const early = structuredClone(s);
    early.dayPlans[0].commitments[0].committedAt = "2024-03-01T10:02:00Z";
    expect(progressProjection(early).day("2024-03-01").planComplete).toBe(false);
    s = transition(s, { type: "undo", id: s.completions[0].id }, draftTime + 2000);
    s = transition(s, { type: "complete" }, at("2024-03-02T10:00:00Z"));
    expect(progressProjection(s).day("2024-03-01")).toMatchObject({ planComplete: false, committedCompleted: 0 });
    expect(progressProjection(s).day("2024-03-02").unplanned).toHaveLength(1);
    expect(progressProjection(emptySnapshot()).day("2024-03-01").planComplete).toBe(false);
  });
  for (const disposition of ["removed", "deferred"] as const) it(`${disposition} unfinished commitments remain in history and block the marker`, () => {
    let s = create();
    s = transition(s, { type: "day-draft", date: "2024-03-01", ids: [s.subtasks[0].id], availability: "", minutes: null }, at("2024-03-01T10:00:00Z"));
    s = transition(s, { type: "day-commit", date: "2024-03-01" }, at("2024-03-01T10:00:00Z"));
    s = transition(s, { type: "disposition", date: "2024-03-01", id: s.dayPlans[0].commitments[0].id, disposition }, at("2024-03-01T10:00:01Z"));
    expect(progressProjection(s).day("2024-03-01")).toMatchObject({ planComplete: false, committedCompleted: 0 });
    expect(progressProjection(s).day("2024-03-01").commitments[0].record.disposition).toBe(disposition);
    s = transition(s, { type: "complete" }, at("2024-03-01T10:01:00Z"));
    expect(progressProjection(s).day("2024-03-01").planComplete).toBe(true);
  });
  it("adds dailyElapsed only, across sessions/midnight/DST; saves are latest context not a heartbeat history", () => {
    let s = create();
    s.calendarTimeZone = "America/New_York";
    s = transition(s, { type: "start", minutes: 5 }, at("2024-03-10T04:59:30Z"));
    s = transition(s, { type: "save" }, at("2024-03-10T05:00:30Z"));
    s = transition(s, { type: "complete" }, at("2024-03-10T05:01:00Z"));
    s = create(s, at("2024-03-10T06:59:30Z"));
    s = transition(s, { type: "start", minutes: 5 }, at("2024-03-10T06:59:30Z"));
    s = transition(s, { type: "save" }, at("2024-03-10T07:00:30Z"));
    s = transition(s, { type: "note", note: "Latest context, not historical evidence" }, at("2024-03-10T07:00:31Z"));
    snapshotSchema.parse(s);
    const before = structuredClone(s);
    const p = progressProjection(s, at("2024-03-11T12:00:00Z"));
    expect(p.day("2024-03-09").recordedMs).toBe(30000);
    expect(p.day("2024-03-10").recordedMs).toBe(90000);
    expect(p.day("2024-03-10").sessions).toHaveLength(2);
    expect(p.day("2024-03-10").saves).toHaveLength(2);
    expect(p.totals("2024-03-09", "2024-03-10").recordedMs).toBe(120000);
    const noSave = structuredClone(s);
    noSave.mountains.forEach(m => { m.savedAt = null; m.savedSubtaskId = null; });
    expect(progressProjection(noSave).day("2024-03-10").saves).toHaveLength(0);
    expect(s).toEqual(before);
    expect(formatRecordedTime(500)).toBe("<1s");
    expect(formatRecordedTime(12500)).toBe("12s");
    expect(formatRecordedTime(90000)).toBe("1m 30s");
  });
  it("uses completion.localDate even when the browser or current snapshot timezone differs", () => {
    let s = create();
    s.calendarTimeZone = "Asia/Tokyo";
    s = transition(s, { type: "complete" }, at("2024-03-01T15:01:00Z"));
    expect(s.completions[0].localDate).toBe("2024-03-02");
    s.calendarTimeZone = "America/Los_Angeles";
    expect(progressProjection(s).day("2024-03-02").count).toBe(1);
    expect(dateKey(at(s.completions[0].completedAt), s.calendarTimeZone)).toBe("2024-03-01");
  });
  it("aggregates several completions separately from time and summit records", () => {
    let s = create();
    for (let i = 0; i < 6; i++) {
      if (i) s = create(s);
      s = transition(s, { type: "complete" }, at("2024-03-01T10:01:00Z"));
    }
    s = transition(s, { type: "confirm-summit", mountainId: s.mountains.at(-1)!.id }, at("2024-03-01T10:02:00Z"));
    const p = progressProjection(s);
    expect(p.day("2024-03-01").count).toBe(6);
    expect(p.totals("2024-03-01", "2024-03-07")).toEqual({ completions: 6, days: 1, recordedMs: 0 });
  });
  it("keeps the fall DST repeated hour on its actual date without double-counting", () => {
    let s = create();
    s.calendarTimeZone = "America/New_York";
    s = transition(s, { type: "start", minutes: 5 }, at("2024-11-03T05:59:30Z"));
    s = transition(s, { type: "save" }, at("2024-11-03T06:00:30Z"));
    const p = progressProjection(s);
    expect(p.day("2024-11-03").recordedMs).toBe(60000);
    expect(p.day("2024-11-03").count).toBe(0);
    expect(p.day("2024-11-02").recordedMs).toBe(0);
  });
  it("compares equivalent complete local periods, excluding today and the partial first-use day", () => {
    const s = emptySnapshot(at("2024-02-28T12:00:00Z"));
    s.calendarTimeZone = "America/New_York";
    const periods = comparisonPeriods(s, at("2024-03-15T04:30:00Z"));
    expect(periods).toMatchObject({ recent: { start: "2024-03-08", end: "2024-03-14" }, previous: { start: "2024-03-01", end: "2024-03-07" }, sufficient: true });
    s.firstUseAt = "2024-03-01T12:00:00Z";
    expect(comparisonPeriods(s, at("2024-03-15T04:30:00Z")).sufficient).toBe(false);
    expect(comparisonPeriods(emptySnapshot()).sufficient).toBe(false);
  });
});

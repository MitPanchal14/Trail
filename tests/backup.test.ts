import { expect, it, vi } from "vitest";
import { emptySnapshot, currentSession, type Snapshot } from "../lib/domain";
import { transition } from "../lib/actions";
import { MAX_BACKUP_BYTES, parseBackup, prepareBackup, readBackup } from "../lib/backup";
import { newDraft } from "../lib/planning";
const now = Date.parse("2026-10-19T12:00:00Z");
function fixture() {
  let s = transition(emptySnapshot(now), { type: "create", title: "Fictional garden", action: "Draw fern", finishCondition: "Checked", minutes: 2 }, now);
  s = transition(s, { type: "day-draft", date: "2026-10-19", ids: [s.subtasks[0].id], availability: "", minutes: 10 }, now);
  s = transition(s, { type: "day-commit", date: "2026-10-19" }, now);
  s = transition(s, { type: "start", minutes: 2 }, now);
  s = transition(s, { type: "note", note: "Fictional private stopping note" }, now + 12000);
  s = transition(s, { type: "return-step", value: "Draw the next fern" }, now + 12000);
  s = transition(s, { type: "save" }, now + 12000);
  s.creationDraft = { ...newDraft(), description: "Fictional next project" };
  return s;
}
it("reads existing pretty-printed export and restores genuine IDs/slots/fields/draft/commitments unchanged", async () => {
  const s = fixture(), text = JSON.stringify(s, null, 2);
  const read = await readBackup({ size: new TextEncoder().encode(text).length, text: async () => text });
  expect(read).toEqual(s);
  expect(prepareBackup(read, s.revision + 1)).toEqual({ ...s, revision: s.revision + 1 });
});
it("retains completion, Undo and corrected summit history without earning anything", () => {
  let s = transition(fixture(), { type: "complete" }, now + 13000);
  s = transition(s, { type: "confirm-summit", mountainId: s.mountains[0].id }, now + 14000);
  s = transition(s, { type: "undo", id: s.completions[0].id, correctSummit: true }, now + 15000);
  expect(prepareBackup(parseBackup(JSON.stringify(s)), 99)).toEqual({ ...s, revision: 99 });
});
it("recovers imported running work at recorded position, with no absence time or automatic completion", () => {
  const s = transition(fixture(), { type: "resume" }, now + 13000);
  const result = prepareBackup(s, 100);
  expect(currentSession(result)).toEqual({ ...currentSession(s), status: "interrupted", runningDeadlineAt: null });
  expect(result.completions).toEqual(s.completions);
  expect(result.summitConfirmations).toEqual(s.summitConfirmations);
  expect(s.sessions[0].status).toBe("running");
});
it("checks exact byte limit before reading and parsing, including multibyte text", async () => {
  const text = JSON.stringify(emptySnapshot(now));
  const boundary = text + " ".repeat(MAX_BACKUP_BYTES - text.length);
  expect(parseBackup(boundary)).toEqual(emptySnapshot(now));
  const reader = vi.fn(async () => boundary);
  await expect(readBackup({ size: MAX_BACKUP_BYTES, text: reader })).resolves.toBeDefined();
  await expect(readBackup({ size: MAX_BACKUP_BYTES + 1, text: reader })).rejects.toThrow("2 MiB");
  expect(reader).toHaveBeenCalledTimes(1);
  expect(() => parseBackup(boundary + " ")).toThrow("2 MiB");
  expect(() => parseBackup(JSON.stringify({ ...emptySnapshot(now), extra: "é".repeat(MAX_BACKUP_BYTES / 2) }))).toThrow("2 MiB");
});
it("retains supported version 1 return-step defaults", () => {
  const s = fixture();
  const legacy = JSON.parse(JSON.stringify(s));
  delete legacy.sessions[0].returnStep;
  expect(parseBackup(JSON.stringify(legacy)).sessions[0].returnStep).toBe("");
});
it("reports JSON, version and file read failures without exposing private payloads", async () => {
  expect(() => parseBackup("private-invalid-json")).toThrow("not valid JSON");
  expect(() => parseBackup(JSON.stringify({ schemaVersion: 2 }))).toThrow("Unsupported backup version");
  await expect(readBackup({ size: 1, text: async () => { throw Error("private file path"); } })).rejects.toThrow("file could not be read");
});
const corruptions: Record<string, (s: Snapshot) => void> = {
  reference: s => { s.subtasks[0].mountainId = crypto.randomUUID(); },
  date: s => { s.sessions[0].dailyElapsed = { "2026-02-30": 12000 }; },
  duplicate: s => { s.subtasks.push(s.subtasks[0]); },
  contradictory: s => { s.sessions[0].creditedMs++; },
};
for (const [label, corrupt] of Object.entries(corruptions)) it(`rejects invalid ${label} without changing the source`, () => {
  const s = fixture(); corrupt(s);
  const before = JSON.stringify(s);
  expect(() => parseBackup(before)).toThrow("Invalid Trail");
  expect(JSON.stringify(s)).toBe(before);
});

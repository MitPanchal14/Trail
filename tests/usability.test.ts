import { it, expect } from "vitest";
import { meaningfulDraft, newDraft, distinctInstruction } from "../lib/planning";
import { emptySnapshot } from "../lib/domain";
import { loadSnapshot } from "../lib/storage";
it("ignores whitespace, generated IDs and default blank rows but preserves meaningful edits", () => {
  const d = newDraft();
  d.description = " \n ";
  d.steps = [{ key: crypto.randomUUID(), existingId: null, title: " ", nextAction: "", suggestedMinutes: 20 }];
  expect(meaningfulDraft(d)).toBe(false);
  for (const field of ["description", "alreadyDone", "stuck", "constraints", "clarification", "goal", "finishCondition"] as const)
    expect(meaningfulDraft({ ...d, [field]: "Useful context" })).toBe(true);
  expect(meaningfulDraft({ ...d, steps: [{ ...d.steps[0], suggestedMinutes: 5 }] })).toBe(true);
  const s = emptySnapshot(); s.creationDraft = d;
  const raw = JSON.stringify(s);
  expect(loadSnapshot({ getItem: () => raw }).snapshot.creationDraft).toBeNull();
  expect(loadSnapshot({ getItem: () => raw }).raw).toBe(raw);
});
it("suppresses only blank or normalized duplicate instructions", () => {
  expect(distinctInstruction("Read PAPER", " read   paper \n")).toBe(false);
  expect(distinctInstruction("Read", " \n")).toBe(false);
  expect(distinctInstruction("Read", "Read one abstract and write two notes.")).toBe(true);
});

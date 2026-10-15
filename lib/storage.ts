import { emptySnapshot, snapshotSchema, type Snapshot } from "./domain";
import { recoverSnapshot } from "./actions";
import { meaningfulDraft } from "./planning";
export const STORAGE_KEY = "work-trail:snapshot:v1";
export function loadSnapshot(storage: Pick<Storage, "getItem">): {
  snapshot: Snapshot;
  warning: string;
  raw: string | null;
  blocked: boolean;
} {
  let raw: string | null = null;
  try {
    raw = storage.getItem(STORAGE_KEY);
    if (raw === null)
      return {
        snapshot: emptySnapshot(),
        warning: "",
        raw: null,
        blocked: false,
      };
    if (raw.length > 2 * 1024 * 1024) throw Error("Snapshot too large");
    const snapshot = recoverSnapshot(snapshotSchema.parse(JSON.parse(raw)));
    if (!meaningfulDraft(snapshot.creationDraft)) snapshot.creationDraft = null;
    return {
      snapshot,
      warning: "",
      raw,
      blocked: false,
    };
  } catch {
    return {
      snapshot: emptySnapshot(),
      warning:
        raw === null
          ? "Browser storage cannot be read. Work is in memory only; download a recovery copy before leaving."
          : "Stored records could not be validated. The original has not been overwritten. New work is in memory only; download recovery copies.",
      raw,
      blocked: true,
    };
  }
}
export function saveSnapshot(
  storage: Pick<Storage, "setItem">,
  snapshot: Snapshot,
): string {
  try {
    storage.setItem(
      STORAGE_KEY,
      JSON.stringify(snapshotSchema.parse(snapshot)),
    );
    return "";
  } catch {
    return "Not saved to this browser. Storage is blocked, full or records failed validation. Work remains in memory; download a private recovery copy before leaving.";
  }
}
export function downloadPrivate(content: string, filename: string) {
  const url = URL.createObjectURL(
    new Blob([content], { type: "application/json" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

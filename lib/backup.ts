import { snapshotSchema, type Snapshot } from "./domain";
import { recoverSnapshot } from "./actions";

export const MAX_BACKUP_BYTES = 2 * 1024 * 1024;
const sizeError = "Choose a Trail JSON backup no larger than 2 MiB.";

export function parseBackup(text: string): Snapshot {
  if (new TextEncoder().encode(text).byteLength > MAX_BACKUP_BYTES) throw Error(sizeError);
  let value: unknown;
  try { value = JSON.parse(text); } catch { throw Error("This file is not valid JSON. Choose an exported Trail backup."); }
  if (value && typeof value === "object" && "schemaVersion" in value && value.schemaVersion !== 1)
    throw Error("Unsupported backup version. Choose a version 1 Trail backup.");
  const result = snapshotSchema.safeParse(value);
  if (!result.success) throw Error("Invalid Trail records, references or dates. Choose an intact exported backup; your current records are unchanged.");
  return result.data;
}

export async function readBackup(file: Pick<File, "size" | "text">): Promise<Snapshot> {
  if (file.size > MAX_BACKUP_BYTES) throw Error(sizeError);
  let text: string;
  try { text = await file.text(); } catch { throw Error("The file could not be read. Select it again or choose another backup."); }
  return parseBackup(text);
}

// No elapsed-time accounting: imported running sessions stop at their heartbeat.
export function prepareBackup(snapshot: Snapshot, revision: number): Snapshot {
  return snapshotSchema.parse({ ...recoverSnapshot(snapshotSchema.parse(snapshot)), revision });
}

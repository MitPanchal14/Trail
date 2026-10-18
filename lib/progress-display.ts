import { formatRecordedTime } from "./progress";

// Overview precision only; the unchanged exact-duration formatter and raw
// recorded seconds remain available in the relevant detailed disclosure.
export function overviewTime(ms: number) {
  if (ms < 60000) return formatRecordedTime(ms);
  const minutes = Math.floor(ms / 60000);
  return minutes < 60 ? `${minutes}m` : `${Math.floor(minutes / 60)}h${minutes % 60 ? ` ${minutes % 60}m` : ""}`;
}

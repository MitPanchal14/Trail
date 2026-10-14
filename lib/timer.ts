import { dateKey, type Session } from "./domain";

export function account(session: Session, now: number, zone: string): Session {
  if (session.status !== "running") return session;
  const delta = now - Date.parse(session.lastAccountedAt);
  if (!Number.isSafeInteger(delta) || delta < 0 || delta > 86400000)
    return { ...session, status: "interrupted", runningDeadlineAt: null };
  const credited = Math.min(delta, session.remainingMs),
    dailyElapsed = { ...session.dailyElapsed };
  let start = Date.parse(session.lastAccountedAt),
    end = start + credited;
  while (start < end) {
    const key = dateKey(start, zone);
    let boundary = end;
    if (dateKey(end - 1, zone) !== key) {
      let lo = start,
        hi = end;
      while (lo + 1 < hi) {
        const mid = Math.floor((lo + hi) / 2);
        if (dateKey(mid, zone) === key) lo = mid;
        else hi = mid;
      }
      boundary = hi;
    }
    dailyElapsed[key] = (dailyElapsed[key] ?? 0) + boundary - start;
    start = boundary;
  }
  const remainingMs = session.remainingMs - credited;
  return {
    ...session,
    remainingMs,
    creditedMs: session.creditedMs + credited,
    dailyElapsed,
    lastHeartbeatAt: new Date(now).toISOString(),
    lastAccountedAt: new Date(now).toISOString(),
    status: remainingMs ? "running" : "expired",
    runningDeadlineAt: remainingMs
      ? new Date(now + remainingMs).toISOString()
      : null,
  };
}
export function recover(s: Session): Session {
  return s.status === "running"
    ? { ...s, status: "interrupted", runningDeadlineAt: null }
    : s;
}
export function resume(s: Session, now: number): Session {
  return s.remainingMs > 0
    ? {
        ...s,
        status: "running",
        lastAccountedAt: new Date(now).toISOString(),
        lastHeartbeatAt: new Date(now).toISOString(),
        runningDeadlineAt: new Date(now + s.remainingMs).toISOString(),
      }
    : s;
}

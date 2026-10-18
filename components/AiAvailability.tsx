"use client";
import { useEffect, useState } from "react";

export function useAiAvailability() {
  const [status, setStatus] = useState({ available: false, message: "Checking AI configuration… Manual editing is always available." });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    let active = true;
    fetch("/api/plan?availability=1", { cache: "no-store", signal: controller.signal })
      .then(async response => {
        const body = await response.json();
        if (!response.ok || typeof body.available !== "boolean" || typeof body.message !== "string" || body.message.length > 500) throw Error("Invalid status");
        if (active) setStatus({ available: body.available, message: body.message });
      })
      .catch(() => { if (active) setStatus({ available: false, message: "Could not check AI availability. Your input is retained; use manual editing or recheck." }); })
      .finally(() => clearTimeout(timeout));
    return () => { active = false; clearTimeout(timeout); controller.abort(); };
  }, [attempt]);
  return { ...status, recheck: () => { setStatus({ available: false, message: "Checking AI configuration… Manual editing is always available." }); setAttempt(x => x + 1); } };
}
export default function AiAvailability({ message, recheck }: { message: string; recheck: () => void }) {
  return <div className="ai-availability"><p className="session-time" role="status">{message}</p><button type="button" className="quiet" onClick={recheck}>Recheck AI availability</button></div>;
}

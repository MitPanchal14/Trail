"use client";
import { useEffect, useRef, useState } from "react";
import { currentSession, type Snapshot } from "./domain";
import { transition, type Action } from "./actions";
import { loadSnapshot, saveSnapshot, STORAGE_KEY } from "./storage";
import { ownTab } from "./tab-ownership";

export function useWorkTrail() {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null),
    [owned, setOwned] = useState(false),
    [warning, setWarning] = useState(""),
    [notice, setNotice] = useState("");
  const state = useRef<Snapshot | null>(null),
    blocked = useRef(false),
    guard = useRef<ReturnType<typeof ownTab> | null>(null),
    warningRef = useRef("");
  const [raw, setRaw] = useState<string | null>(null);
  const expectedRaw = useRef<string | null>(null);
  const wall = useRef(0),
    steady = useRef(0);
  const publish = (s: Snapshot) => {
    state.current = s;
    setSnapshot(s);
  };
  const warn = (value: string) => {
    warningRef.current = value;
    setWarning(value);
  };
  const persist = (s: Snapshot) => {
    if (blocked.current) return;
    if (!guard.current?.valid()) return;
    let error = "";
    try {
      if (localStorage.getItem(STORAGE_KEY) !== expectedRaw.current) {
        error =
          "Stored data changed outside this editing session. Your in-memory work has not overwritten it. Download recovery before reloading.";
        setRaw(localStorage.getItem(STORAGE_KEY));
      } else {
        error = saveSnapshot(localStorage, s);
        if (!error) expectedRaw.current = JSON.stringify(s);
      }
    } catch {
      error =
        "Browser storage is unavailable. Work is in memory only; download recovery before leaving.";
    }
    if (error) {
      blocked.current = true;
      warn(error);
    }
  };
  const dispatch = (action: Action) => {
    if (!guard.current?.valid()) {
      setOwned(false);
      setNotice(
        "Another tab owns editing, or ownership needs to be reacquired. No changes were written.",
      );
      return false;
    }
    if (!state.current) return false;
    try {
      const now = Date.now(),
        monotonic = performance.now();
      let s = state.current;
      if (
        currentSession(s)?.status === "running" &&
        wall.current &&
        (now < wall.current ||
          Math.abs(now - wall.current - (monotonic - steady.current)) > 5000)
      ) {
        s = transition(s, { type: "interrupt" }, now);
        setNotice(
          "The clock changed unexpectedly. Timing stopped at its last recorded position; Resume when ready.",
        );
      }
      const next = transition(s, action, now);
      const linkedUndo = action.type === "undo" && s.summitConfirmations.some(c => !c.revokedAt && c.relatedCompletionIds.includes(action.id));
      const transactional = linkedUndo || ["undo", "select", "day-commit", "start-next", "edit-draft", "confirm-summit", "reopen-goal", "correct-summit"].includes(action.type);
      if (transactional) {
        if (blocked.current || next === s) return false;
        persist(next);
        if (blocked.current || !guard.current?.valid()) return false;
      }
      wall.current = now;
      steady.current = monotonic;
      publish(next);
      if (!transactional) persist(next);
      return true;
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "The change could not be applied.",
      );
      return false;
    }
  };
  const dispatchRef = useRef(dispatch);
  useEffect(() => {
    dispatchRef.current = dispatch;
  });
  useEffect(() => {
    let active = true;
    const load = () => {
      let loaded;
      try {
        loaded = loadSnapshot(localStorage);
      } catch {
        loaded = loadSnapshot({
          getItem: () => {
            throw Error("Storage blocked");
          },
        });
      }
      blocked.current = loaded.blocked;
      setRaw(loaded.raw);
      expectedRaw.current = loaded.raw;
      warn(loaded.warning);
      publish(loaded.snapshot);
    };
    load();
    const controller = ownTab((value) => {
      if (!active) return;
      setOwned(value);
      if (value) {
        if (!warningRef.current) load();
        wall.current = Date.now();
        steady.current = performance.now();
      } else if (state.current) {
        publish(transition(state.current, { type: "interrupt" }));
        setNotice(
          "Editing is protected by another tab. Return here after closing the other tab.",
        );
      }
    });
    guard.current = controller;
    const timer = setInterval(() => {
      if (
        controller.valid() &&
        currentSession(state.current!)?.status === "running"
      )
        dispatchRef.current({ type: "tick" });
    }, 1000);
    const hide = () => {
      if (
        controller.valid() &&
        state.current &&
        currentSession(state.current)?.status === "running"
      ) {
        dispatchRef.current({ type: "tick" });
        dispatchRef.current({ type: "interrupt" });
      }
      controller.stop();
    };
    const show = (event: PageTransitionEvent) => {
      if (event.persisted) location.reload();
    };
    const changed = (event: StorageEvent) => {
      if (
        event.key === STORAGE_KEY &&
        !controller.valid() &&
        !warningRef.current
      )
        load();
    };
    window.addEventListener("pagehide", hide);
    window.addEventListener("pageshow", show);
    window.addEventListener("storage", changed);
    return () => {
      active = false;
      clearInterval(timer);
      controller.stop();
      window.removeEventListener("pagehide", hide);
      window.removeEventListener("pageshow", show);
      window.removeEventListener("storage", changed);
    };
  }, []);
  return { snapshot, owned, warning, notice, dispatch, raw };
}

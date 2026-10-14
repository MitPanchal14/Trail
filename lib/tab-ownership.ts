const NAME = "work-trail:writer";
const LEASE = NAME + ":lease";
/** Web Locks never expire while a tab is alive. Fallback checks its lease before every write. */
export function ownTab(onChange: (owned: boolean) => void) {
  let alive = true,
    owned = false,
    release: (() => void) | undefined,
    busy = false;
  const token = crypto.randomUUID();
  let timer: ReturnType<typeof setInterval>;
  const set = (value: boolean) => {
    if (owned !== value) {
      owned = value;
      onChange(value);
    }
  };
  const lease = () => {
    try {
      return JSON.parse(localStorage.getItem(LEASE) ?? "null") as {
        token: string;
        expires: number;
      } | null;
    } catch {
      return null;
    }
  };
  const locks = typeof navigator.locks?.request === "function";
  const valid = () =>
    alive &&
    owned &&
    (locks ||
      (lease()?.token === token && Number(lease()?.expires) > Date.now()));
  const attempt = () => {
    if (!alive || busy) return;
    if (locks) {
      if (owned) return;
      busy = true;
      void navigator.locks
        .request(NAME, { ifAvailable: true }, async (lock) => {
          busy = false;
          if (!lock || !alive) return;
          set(true);
          await new Promise<void>((resolve) => {
            release = resolve;
          });
          set(false);
        })
        .catch(() => {
          busy = false;
          set(false);
        });
    } else {
      const current = lease();
      if (current && current.token !== token && current.expires > Date.now()) {
        set(false);
        return;
      }
      if (owned && !valid()) set(false);
      try {
        localStorage.setItem(
          LEASE,
          JSON.stringify({ token, expires: Date.now() + 5000 }),
        );
      } catch {
        set(false);
        return;
      }
      busy = true;
      setTimeout(() => {
        busy = false;
        if (alive) set(lease()?.token === token);
      }, 150);
    }
  };
  const changed = (e: StorageEvent) => {
    if (e.key === LEASE && !locks && owned && !valid()) set(false);
  };
  window.addEventListener("storage", changed);
  attempt();
  timer = setInterval(attempt, 1000);
  return {
    valid,
    stop: () => {
      alive = false;
      clearInterval(timer);
      window.removeEventListener("storage", changed);
      release?.();
      if (!locks && lease()?.token === token) {
        try {
          localStorage.removeItem(LEASE);
        } catch {
          /* blocked storage */
        }
      }
      set(false);
    },
  };
}

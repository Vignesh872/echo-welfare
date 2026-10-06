import { useCallback, useEffect, useState } from "react";

export function storageAvailable(): boolean {
  try {
    const k = "__w360_test";
    window.localStorage.setItem(k, "1");
    window.localStorage.removeItem(k);
    return true;
  } catch {
    return false;
  }
}

/** Hydration-safe localStorage state. `ready` is false until read on the client. */
export function useLocalState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    const ok = storageAvailable();
    setAvailable(ok);
    if (ok) {
      try {
        const raw = window.localStorage.getItem(key);
        if (raw != null) setValue(JSON.parse(raw) as T);
      } catch { /* corrupt data — keep initial */ }
    }
    setReady(true);
  }, [key]);

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const v = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        try { window.localStorage.setItem(key, JSON.stringify(v)); } catch { setAvailable(false); }
        return v;
      });
    },
    [key],
  );

  return [value, update, { ready, available }] as const;
}

export const KEYS = {
  responses: "w360.responses.v1",
  details: "w360.details.v1",
  initiatives: "w360.initiatives.v1",
};

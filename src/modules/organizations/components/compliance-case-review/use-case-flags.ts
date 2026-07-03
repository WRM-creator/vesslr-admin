import { useCallback, useMemo, useState } from "react";
import { reasonKey, type ReasonOption } from "./reason-options";

/** A reviewer-flagged issue on a piece of evidence, with an optional note. */
export interface CaseFlag extends ReasonOption {
  note?: string;
}

/**
 * Case-scoped flag store. The reviewer flags issues in place (on documents and
 * check rows); flags accumulate here and seed the Request-changes sheet, so the
 * sheet summarizes what was found rather than being authored cold. Keyed by
 * `target:issue`, so flagging the same issue twice is idempotent.
 */
export function useCaseFlags() {
  const [byKey, setByKey] = useState<Record<string, CaseFlag>>({});

  const toggle = useCallback((option: ReasonOption) => {
    const key = reasonKey(option);
    setByKey((prev) => {
      if (prev[key]) {
        const next = { ...prev };
        delete next[key];
        return next;
      }
      return { ...prev, [key]: { ...option } };
    });
  }, []);

  const has = useCallback(
    (option: Pick<ReasonOption, "target" | "issue">) =>
      Boolean(byKey[reasonKey(option)]),
    [byKey],
  );

  /** The stored flag (with its note) for an option, if flagged. */
  const get = useCallback(
    (option: Pick<ReasonOption, "target" | "issue">): CaseFlag | undefined =>
      byKey[reasonKey(option)],
    [byKey],
  );

  /** Attach or update the free-text note on an already-flagged issue. */
  const setNote = useCallback(
    (option: Pick<ReasonOption, "target" | "issue">, note: string) => {
      const key = reasonKey(option);
      setByKey((prev) =>
        prev[key] ? { ...prev, [key]: { ...prev[key], note } } : prev,
      );
    },
    [],
  );

  /** How many issues are flagged against a given target (for the flag button). */
  const countForTarget = useCallback(
    (target: string) =>
      Object.values(byKey).filter((f) => f.target === target).length,
    [byKey],
  );

  const clear = useCallback(() => setByKey({}), []);

  const flags = useMemo(() => Object.values(byKey), [byKey]);

  return {
    flags,
    count: flags.length,
    toggle,
    has,
    get,
    setNote,
    countForTarget,
    clear,
  };
}

export type CaseFlagsApi = ReturnType<typeof useCaseFlags>;

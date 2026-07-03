import { useCallback, useMemo, useState } from "react";
import { composeDocRequestNote } from "./document-issues";

/** A document to (re-)request, with the note composed from its flagged issues. */
export interface DocRequest {
  type: string;
  label: string;
  note?: string;
}

/** Internal per-document state: the flagged issues (a set) + an optional note. */
interface DocEntry {
  type: string;
  label: string;
  issues: Record<string, true>;
  note: string;
}

/**
 * Case-scoped store of documents to re-request, the document counterpart to
 * {@link useCaseFlags}. Provided free-form admin-requested docs (e.g. a bank
 * statement) have no reason target, so they can't be structured-flagged; instead
 * the reviewer flags generic issues on them here (unreadable, outdated, …) plus
 * an optional note. Each entry composes into a fresh document request whose note
 * carries those issues to the applicant. Keyed by `type`; an entry drops out once
 * it has no issues and no note.
 */
export function useDocRequests() {
  const [byType, setByType] = useState<Record<string, DocEntry>>({});

  /** Drop an entry once it carries neither an issue nor a note. */
  const prune = (entry: DocEntry): DocEntry | null =>
    Object.keys(entry.issues).length === 0 && !entry.note.trim() ? null : entry;

  const toggleIssue = useCallback(
    (doc: { type: string; label: string }, issue: string) => {
      setByType((prev) => {
        const entry = prev[doc.type] ?? {
          type: doc.type,
          label: doc.label,
          issues: {},
          note: "",
        };
        const issues = { ...entry.issues };
        if (issues[issue]) delete issues[issue];
        else issues[issue] = true;
        const next = prune({ ...entry, issues });
        const copy = { ...prev };
        if (next) copy[doc.type] = next;
        else delete copy[doc.type];
        return copy;
      });
    },
    [],
  );

  const setNote = useCallback(
    (doc: { type: string; label: string }, note: string) => {
      setByType((prev) => {
        const entry = prev[doc.type] ?? {
          type: doc.type,
          label: doc.label,
          issues: {},
          note: "",
        };
        const next = prune({ ...entry, note });
        const copy = { ...prev };
        if (next) copy[doc.type] = next;
        else delete copy[doc.type];
        return copy;
      });
    },
    [],
  );

  const hasIssue = useCallback(
    (type: string, issue: string) => Boolean(byType[type]?.issues[issue]),
    [byType],
  );

  const noteFor = useCallback(
    (type: string) => byType[type]?.note ?? "",
    [byType],
  );

  const countForType = useCallback(
    (type: string) => Object.keys(byType[type]?.issues ?? {}).length,
    [byType],
  );

  const isActive = useCallback((type: string) => Boolean(byType[type]), [byType]);

  const clear = useCallback(() => setByType({}), []);

  const list = useMemo<DocRequest[]>(
    () =>
      Object.values(byType).map((e) => ({
        type: e.type,
        label: e.label,
        note: composeDocRequestNote(Object.keys(e.issues), e.note) || undefined,
      })),
    [byType],
  );

  return {
    list,
    count: list.length,
    toggleIssue,
    setNote,
    hasIssue,
    noteFor,
    countForType,
    isActive,
    clear,
  };
}

export type DocRequestsApi = ReturnType<typeof useDocRequests>;

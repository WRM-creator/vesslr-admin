import { ExternalLink, FileText } from "lucide-react";

interface TransactionQQDocumentsProps {
  documents?: { name: string; url: string }[];
}

export function TransactionQQDocuments({
  documents,
}: TransactionQQDocumentsProps) {
  if (!documents || documents.length === 0) {
    return (
      <div className="text-muted-foreground rounded-md border border-dashed py-6 text-center text-sm">
        No inspection documents submitted yet.
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {documents.map((doc, i) => (
        <li
          key={i}
          className="flex items-center justify-between gap-3 rounded-md border px-3 py-2"
        >
          <div className="flex items-center gap-2 truncate">
            <FileText className="text-muted-foreground size-4 shrink-0" />
            <span className="truncate text-sm">{doc.name}</span>
          </div>
          <a
            href={doc.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primaryGreenDark flex shrink-0 items-center gap-1 text-xs hover:underline"
          >
            View
            <ExternalLink className="size-3" />
          </a>
        </li>
      ))}
    </ul>
  );
}

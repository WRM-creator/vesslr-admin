import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import type { ProductDetails } from "../lib/product-details-model";

interface ProductAdminNotesCardProps {
  data: ProductDetails["admin"];
}

export function ProductAdminNotesCard({ data }: ProductAdminNotesCardProps) {
  return (
    <div className="space-y-6">
      {/* Risk Score */}
      <div className="flex items-center justify-between">
        <span className="font-medium text-amber-800 dark:text-amber-500">
          Risk Score
        </span>
        <Badge
          variant="outline"
          className={`${
            data.riskScore > 70
              ? "border-red-500 bg-red-50 text-red-600"
              : data.riskScore > 30
                ? "border-amber-500 bg-amber-50 text-amber-600"
                : "border-green-500 bg-green-50 text-green-600"
          } dark:bg-transparent`}
        >
          {data.riskScore} / 100
        </Badge>
      </div>

      {/* Notes List */}
      <div className="space-y-4">
        {data.notes.map((note) => (
          <div key={note.id} className="space-y-1">
            <div className="flex items-center justify-between text-xs text-amber-700/70 dark:text-amber-500/70">
              <span className="font-medium">{note.author}</span>
              <span>{new Date(note.date).toLocaleDateString()}</span>
            </div>
            <p className="text-sm leading-relaxed text-amber-900/80 dark:text-amber-400/90">
              {note.content}
            </p>
          </div>
        ))}

        {data.notes.length === 0 && (
          <div className="text-sm text-amber-700/50 italic dark:text-amber-500/50">
            No notes added yet.
          </div>
        )}
      </div>

      {/* Add Note Input */}
      <div className="space-y-2 border-t border-amber-200/50 pt-2 dark:border-amber-800/50">
        <Textarea
          placeholder="Add an internal note..."
          className="min-h-[80px] border-amber-200 bg-white/50 placeholder:text-amber-700/30 focus-visible:ring-amber-500/50 dark:border-amber-800 dark:bg-black/20 dark:placeholder:text-amber-500/30"
        />
        <Button
          size="sm"
          variant="secondary"
          className="w-full bg-amber-100 text-amber-900 hover:bg-amber-200 dark:bg-amber-900/40 dark:text-amber-100 dark:hover:bg-amber-900/60"
        >
          <Plus className="mr-2 h-3 w-3" />
          Add Note
        </Button>
      </div>
    </div>
  );
}

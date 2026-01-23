import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import type { CustomerDetails } from "../lib/customer-details-model";

interface CustomerSystemNotesCardProps {
  data: CustomerDetails["admin"];
}

export function CustomerSystemNotesCard({
  data,
}: CustomerSystemNotesCardProps) {
  return (
    <div className="space-y-4">
      <div className="max-h-[300px] space-y-4 overflow-y-auto pr-2">
        {data.notes.length === 0 ? (
          <div className="text-muted-foreground py-4 text-center text-sm italic">
            No notes added yet.
          </div>
        ) : (
          data.notes.map((note) => (
            <div key={note.id} className="flex gap-3">
              <Avatar className="mt-1 h-8 w-8">
                <AvatarFallback className="bg-amber-200 text-xs text-amber-800 dark:bg-amber-900 dark:text-amber-100">
                  {note.author
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{note.author}</span>
                  <span className="text-muted-foreground text-xs">
                    {format(new Date(note.date), "MMM d, yyyy")}
                  </span>
                </div>
                <div className="text-muted-foreground bg-background/50 rounded-md border border-amber-200/50 p-2 text-sm dark:border-amber-900/30">
                  {note.content}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="pt-2">
        <Textarea
          placeholder="Add an internal note..."
          className="bg-background min-h-[80px] border-amber-200 focus-visible:ring-amber-500 dark:border-amber-900"
        />
        <div className="mt-2 flex justify-end">
          <Button size="sm" variant="outline" className="text-xs">
            <Plus className="mr-1 h-3 w-3" /> Add Note
          </Button>
        </div>
      </div>
    </div>
  );
}

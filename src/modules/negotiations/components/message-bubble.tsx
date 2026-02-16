import { cn } from "@/lib/utils";

// Assuming types are similar or using any for flexibility in admin if types aren't fully generated
interface MessageBubbleProps {
  entry: any; // Using any to be safe as admin types might differ slightly or be incomplete
}

export const MessageBubble = ({ entry }: MessageBubbleProps) => {
  const timestamp = new Date(entry.createdAt).toLocaleString();

  // In admin, we don't really have "isMine".
  // We should perhaps align based on who sent it.
  // For now, let's keep it simple: left align everything, or maybe right align "buyer" and left align "seller"?
  // The requirement says "adapt for admin context".
  // Let's just standardise on left alignment for everyone in admin to be neutral,
  // OR use the author entry to distinct.
  // Frontend uses `isMine`. Admin sees all.
  // Let's make everything neutral (gray/left) but maybe different shades?
  // Or better, let's keep the author name prominent.

  // Actually, to make it look like a conversation:
  // Maybe align Buyer left, Seller right?
  // We need to know who is who.
  // `entry` likely has `authorType` or we can derive from `buyerOrganization` / `sellerOrganization`.
  // But strictly, `entry` has `authorName`.

  // Let's stick to a neutral list for admin to avoid confusion about "who am I".
  // So all left-aligned.

  const isSystem = false; // logic for system messages if any

  return (
    <div className={cn("flex justify-start")}>
      <div
        className={cn("bg-muted max-w-[85%] space-y-1 rounded-lg px-4 py-2")}
      >
        <div className="flex items-center gap-2">
          <p className="text-foreground text-xs font-semibold">
            {entry.authorName || "Unknown"}
          </p>
          <span className="text-muted-foreground text-[10px]">{timestamp}</span>
        </div>
        <p className="text-foreground text-sm">{entry.text}</p>
      </div>
    </div>
  );
};

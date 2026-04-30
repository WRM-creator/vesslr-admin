import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import type { Control } from "react-hook-form";
import type { CmsPageFormValues } from "../../lib/schemas";

interface MarkdownBlockEditorProps {
  index: number;
  control: Control<CmsPageFormValues>;
}

export function MarkdownBlockEditor({
  index,
  control,
}: MarkdownBlockEditorProps) {
  return (
    <div className="grid gap-4">
      <FormField
        control={control}
        name={`blocks.${index}.data.content`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Markdown Content</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Write markdown here..."
                rows={12}
                className="font-mono text-sm"
                {...field}
                value={(field.value as string) ?? ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Control } from "react-hook-form";
import type { CmsPageFormValues } from "../../lib/schemas";

interface TextBlockEditorProps {
  index: number;
  control: Control<CmsPageFormValues>;
}

export function TextBlockEditor({ index, control }: TextBlockEditorProps) {
  return (
    <div className="grid gap-4">
      <FormField
        control={control}
        name={`blocks.${index}.data.heading`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Heading</FormLabel>
            <FormControl>
              <Input placeholder="Section heading (optional)" {...field} value={(field.value as string) ?? ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`blocks.${index}.data.body`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Body</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Enter text content..."
                rows={6}
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

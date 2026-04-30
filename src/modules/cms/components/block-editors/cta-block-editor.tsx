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

interface CtaBlockEditorProps {
  index: number;
  control: Control<CmsPageFormValues>;
}

export function CtaBlockEditor({ index, control }: CtaBlockEditorProps) {
  return (
    <div className="grid gap-4">
      <FormField
        control={control}
        name={`blocks.${index}.data.heading`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Heading</FormLabel>
            <FormControl>
              <Input placeholder="Call to action heading" {...field} value={(field.value as string) ?? ""} />
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
                placeholder="Supporting text (optional)"
                rows={3}
                {...field}
                value={(field.value as string) ?? ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name={`blocks.${index}.data.buttonLabel`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Button Label</FormLabel>
              <FormControl>
                <Input placeholder="Sign Up Now" {...field} value={(field.value as string) ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`blocks.${index}.data.buttonUrl`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Button URL</FormLabel>
              <FormControl>
                <Input placeholder="/signup" {...field} value={(field.value as string) ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

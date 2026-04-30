import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, type Control } from "react-hook-form";
import type { CmsPageFormValues } from "../../lib/schemas";

interface LegalSectionsBlockEditorProps {
  index: number;
  control: Control<CmsPageFormValues>;
}

export function LegalSectionsBlockEditor({
  index,
  control,
}: LegalSectionsBlockEditorProps) {
  const { fields, append, remove } = useFieldArray({
    control: control as any,
    name: `blocks.${index}.data.sections` as any,
  });

  return (
    <div className="grid gap-4">
      <FormField
        control={control}
        name={`blocks.${index}.data.effectiveDate`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Effective Date</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g. April 2026"
                {...field}
                value={(field.value as string) ?? ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <FormLabel>Sections</FormLabel>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ title: "", content: "" } as any)}
          >
            <Plus className="mr-1 h-3 w-3" />
            Add Section
          </Button>
        </div>

        {fields.map((field, itemIndex) => (
          <div
            key={field.id}
            className="rounded-lg border p-3 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs font-medium">
                Section {itemIndex + 1}
              </span>
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-destructive"
                  onClick={() => remove(itemIndex)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
            <FormField
              control={control}
              name={
                `blocks.${index}.data.sections.${itemIndex}.title` as any
              }
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Section title"
                      {...field}
                      value={(field.value as string) ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={
                `blocks.${index}.data.sections.${itemIndex}.content` as any
              }
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Content (Markdown)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Section content — supports markdown formatting"
                      rows={8}
                      {...field}
                      value={(field.value as string) ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}

        {fields.length > 0 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => append({ title: "", content: "" } as any)}
          >
            <Plus className="mr-1 h-3 w-3" />
            Add Section
          </Button>
        )}
      </div>
    </div>
  );
}

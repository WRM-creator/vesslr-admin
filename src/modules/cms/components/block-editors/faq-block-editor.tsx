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

interface FaqBlockEditorProps {
  index: number;
  control: Control<CmsPageFormValues>;
}

export function FaqBlockEditor({ index, control }: FaqBlockEditorProps) {
  const { fields, append, remove } = useFieldArray({
    control: control as any,
    name: `blocks.${index}.data.items` as any,
  });

  return (
    <div className="grid gap-4">
      <FormField
        control={control}
        name={`blocks.${index}.data.heading`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Heading</FormLabel>
            <FormControl>
              <Input placeholder="FAQ section heading" {...field} value={(field.value as string) ?? ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`blocks.${index}.data.subtitle`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Subtitle</FormLabel>
            <FormControl>
              <Input placeholder="Find quick answers to common questions here." {...field} value={(field.value as string) ?? ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <FormLabel>FAQ Items</FormLabel>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ question: "", answer: "" } as any)}
          >
            <Plus className="mr-1 h-3 w-3" />
            Add Item
          </Button>
        </div>

        {fields.map((field, itemIndex) => (
          <div
            key={field.id}
            className="rounded-lg border p-3 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs font-medium">
                Q&A {itemIndex + 1}
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
                `blocks.${index}.data.items.${itemIndex}.question` as any
              }
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Question</FormLabel>
                  <FormControl>
                    <Input placeholder="Frequently asked question" {...field} value={(field.value as string) ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`blocks.${index}.data.items.${itemIndex}.answer` as any}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Answer</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Answer text" rows={3} {...field} value={(field.value as string) ?? ""} />
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
            onClick={() => append({ question: "", answer: "" } as any)}
          >
            <Plus className="mr-1 h-3 w-3" />
            Add Item
          </Button>
        )}
      </div>
    </div>
  );
}

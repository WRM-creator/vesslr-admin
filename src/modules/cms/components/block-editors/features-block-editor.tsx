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

interface FeaturesBlockEditorProps {
  index: number;
  control: Control<CmsPageFormValues>;
}

export function FeaturesBlockEditor({
  index,
  control,
}: FeaturesBlockEditorProps) {
  const { fields, append, remove } = useFieldArray({
    control: control as any,
    name: `blocks.${index}.data.items` as any,
  });

  return (
    <div className="grid gap-4">
      <FormField
        control={control}
        name={`blocks.${index}.data.sectionLabel`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Section Label</FormLabel>
            <FormControl>
              <Input placeholder="e.g. Our banking services" {...field} value={(field.value as string) ?? ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`blocks.${index}.data.heading`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Heading</FormLabel>
            <FormControl>
              <Input placeholder="Features section heading" {...field} value={(field.value as string) ?? ""} />
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
              <Input placeholder="Section subtitle" {...field} value={(field.value as string) ?? ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <FormLabel>Feature Items</FormLabel>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({ icon: "", title: "", description: "" } as any)
            }
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
                Item {itemIndex + 1}
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
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={control}
                name={`blocks.${index}.data.items.${itemIndex}.icon` as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Icon</FormLabel>
                    <FormControl>
                      <Input placeholder="icon-name" {...field} value={(field.value as string) ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`blocks.${index}.data.items.${itemIndex}.title` as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Feature title" {...field} value={(field.value as string) ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={control}
              name={
                `blocks.${index}.data.items.${itemIndex}.description` as any
              }
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Feature description"
                      rows={2}
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
            onClick={() =>
              append({ icon: "", title: "", description: "" } as any)
            }
          >
            <Plus className="mr-1 h-3 w-3" />
            Add Item
          </Button>
        )}
      </div>
    </div>
  );
}

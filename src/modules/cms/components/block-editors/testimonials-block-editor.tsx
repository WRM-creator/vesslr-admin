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

interface TestimonialsBlockEditorProps {
  index: number;
  control: Control<CmsPageFormValues>;
}

export function TestimonialsBlockEditor({
  index,
  control,
}: TestimonialsBlockEditorProps) {
  const { fields, append, remove } = useFieldArray({
    control: control as any,
    name: `blocks.${index}.data.items` as any,
  });

  return (
    <div className="grid gap-4">
      <FormField
        control={control}
        name={`blocks.${index}.data.label`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Section Label</FormLabel>
            <FormControl>
              <Input placeholder="e.g. Testimonials" {...field} value={(field.value as string) ?? ""} />
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
              <Input placeholder="Testimonials section heading" {...field} value={(field.value as string) ?? ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <FormLabel>Testimonials</FormLabel>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({ text: "", person: "", role: "" } as any)
            }
          >
            <Plus className="mr-1 h-3 w-3" />
            Add Testimonial
          </Button>
        </div>

        {fields.map((field, itemIndex) => (
          <div
            key={field.id}
            className="rounded-lg border p-3 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs font-medium">
                Testimonial {itemIndex + 1}
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
              name={`blocks.${index}.data.items.${itemIndex}.text` as any}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Testimonial Text</FormLabel>
                  <FormControl>
                    <Textarea placeholder="What the person said..." rows={3} {...field} value={(field.value as string) ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={control}
                name={`blocks.${index}.data.items.${itemIndex}.person` as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Person Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} value={(field.value as string) ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`blocks.${index}.data.items.${itemIndex}.role` as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Role / Company</FormLabel>
                    <FormControl>
                      <Input placeholder="CEO, Company" {...field} value={(field.value as string) ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        ))}

        {fields.length > 0 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() =>
              append({ text: "", person: "", role: "" } as any)
            }
          >
            <Plus className="mr-1 h-3 w-3" />
            Add Testimonial
          </Button>
        )}
      </div>
    </div>
  );
}

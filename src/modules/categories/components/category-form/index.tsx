import { Thumbnail } from "@/components/shared/thumbnail";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useFileUpload } from "@/hooks/use-file-upload";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  categoryFormSchema,
  defaultCategoryFormValues,
  type CategoryFormSchema,
} from "./schema";

interface CategoryFormProps {
  initialValues?: Partial<CategoryFormSchema>;
  onSubmit?: (data: CategoryFormSchema) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  submitLabel?: string;
  loadingLabel?: string;
}

export function CategoryForm({
  initialValues,
  onSubmit,
  onCancel,
  isLoading,
  submitLabel = "Create Category",
  loadingLabel = "Creating...",
}: CategoryFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(
    initialValues?.image || null,
  );
  const { uploadFiles, isUploading } = useFileUpload();

  const form = useForm<CategoryFormSchema>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: { ...defaultCategoryFormValues, ...initialValues },
    mode: "onChange",
  });

  useEffect(() => {
    if (initialValues) {
      form.reset({ ...defaultCategoryFormValues, ...initialValues });
      setImageUrl(initialValues.image || null);
    }
  }, [initialValues, form]);

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const [uploaded] = await uploadFiles([file]);
      setImageUrl(uploaded.url);
    } catch {
      toast.error("Failed to upload image");
    }
  }

  const handleSubmit = (data: CategoryFormSchema) => {
    onSubmit?.({ ...data, image: imageUrl || undefined });
  };

  const isBusy = isLoading || isUploading;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="flex items-center gap-4">
          <Thumbnail src={imageUrl} className="size-16" />
          <div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
            >
              {isUploading ? "Uploading..." : imageUrl ? "Change image" : "Add image"}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter category name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter a description for this category (optional)"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A brief description of what this category represents.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="allowedMeasurementTypes"
          render={({ field }) => {
            const TYPES = [
              { value: "count" as const, label: "Count" },
              { value: "volume" as const, label: "Volume" },
              { value: "mass" as const, label: "Mass" },
              { value: "time" as const, label: "Time" },
            ];
            const current = field.value ?? [];
            const toggle = (val: (typeof TYPES)[number]["value"]) => {
              field.onChange(
                current.includes(val)
                  ? current.filter((v) => v !== val)
                  : [...current, val],
              );
            };
            return (
              <FormItem>
                <Label className="text-sm font-medium">
                  Allowed Measurement Types
                </Label>
                <div className="flex flex-wrap gap-2">
                  {TYPES.map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => toggle(value)}
                      className={cn(
                        "rounded-full border px-3 py-1 text-sm font-medium transition-colors",
                        current.includes(value)
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <FormDescription>
                  Which unit families (volume, mass, etc.) are available for
                  listings in this category.
                </FormDescription>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isBusy}>
            {isLoading ? loadingLabel : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}

import { Thumbnail } from "@/components/shared/thumbnail";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
import { Textarea } from "@/components/ui/textarea";
import { useFileUpload } from "@/hooks/use-file-upload";
import { cn } from "@/lib/utils";
import {
  MEASUREMENT_TYPES,
  MEASUREMENT_TYPE_LABELS,
  UNITS,
  unitsByCategory,
  type MeasurementType,
} from "@/types/unit";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, X } from "lucide-react";
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues]);

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

  function handleRemoveImage() {
    setImageUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  const handleSubmit = (data: CategoryFormSchema) => {
    onSubmit?.({ ...data, image: imageUrl || undefined });
  };

  const isBusy = isLoading || isUploading;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="max-w-3xl space-y-6"
      >
        {/* Basic Details */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {/* Image */}
            <div className="space-y-2">
              <FormLabel>Category Image</FormLabel>
              <div className="flex items-center gap-4">
                <Thumbnail src={imageUrl} className="size-16" />
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {isUploading
                      ? "Uploading..."
                      : imageUrl
                        ? "Change image"
                        : "Add image"}
                  </Button>
                  {imageUrl && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveImage}
                    >
                      <X className="mr-1 size-3" />
                      Remove
                    </Button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
              </div>
            </div>

            {/* Name */}
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

            {/* Description */}
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
          </CardContent>
        </Card>

        {/* Allowed Units */}
        <FormField
          control={form.control}
          name="allowedUnits"
          render={({ field }) => (
            <Card>
              <CardHeader>
                <CardTitle>Allowed Units</CardTitle>
                <CardDescription>
                  Select which units are available for listings in this category.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {MEASUREMENT_TYPES.map((cat) => (
                    <UnitCategoryGroup
                      key={cat}
                      category={cat}
                      selectedUnits={field.value ?? []}
                      onToggleUnit={(unit) => {
                        const current = field.value ?? [];
                        field.onChange(
                          current.includes(unit)
                            ? current.filter((u) => u !== unit)
                            : [...current, unit],
                        );
                      }}
                      onToggleCategory={(units, allSelected) => {
                        const current = field.value ?? [];
                        if (allSelected) {
                          field.onChange(
                            current.filter((u) => !units.includes(u)),
                          );
                        } else {
                          const merged = new Set([...current, ...units]);
                          field.onChange([...merged]);
                        }
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </CardContent>
            </Card>
          )}
        />

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isBusy || !form.formState.isDirty}
          >
            {isLoading ? loadingLabel : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}

// ── Collapsible unit category group ──────────────────────────

interface UnitCategoryGroupProps {
  category: MeasurementType;
  selectedUnits: string[];
  onToggleUnit: (unit: string) => void;
  onToggleCategory: (units: string[], allSelected: boolean) => void;
}

function UnitCategoryGroup({
  category,
  selectedUnits,
  onToggleUnit,
  onToggleCategory,
}: UnitCategoryGroupProps) {
  const units = unitsByCategory(category);
  const selectedCount = units.filter((u) => selectedUnits.includes(u)).length;
  const allSelected = selectedCount === units.length;
  const someSelected = selectedCount > 0 && !allSelected;

  // Auto-expand categories that have selections
  const [open, setOpen] = useState(selectedCount > 0);

  // Sync open state when initialValues load
  useEffect(() => {
    if (selectedCount > 0) setOpen(true);
  }, [selectedCount]);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div
        className={cn(
          "rounded-lg border transition-colors",
          selectedCount > 0
            ? "border-primary/30 bg-primary/[0.02]"
            : "border-border",
        )}
      >
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="flex w-full items-center gap-3 px-4 py-3"
          >
            <Checkbox
              checked={allSelected ? true : someSelected ? "indeterminate" : false}
              onCheckedChange={() => {
                onToggleCategory(units, allSelected);
              }}
              onClick={(e) => e.stopPropagation()}
            />
            <span className="flex-1 text-left text-sm font-medium">
              {MEASUREMENT_TYPE_LABELS[category]}
            </span>
            <span className="text-muted-foreground text-xs">
              {selectedCount} of {units.length}
            </span>
            <ChevronDown
              className={cn(
                "text-muted-foreground size-4 transition-transform",
                open && "rotate-180",
              )}
            />
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="border-t px-4 py-2">
            <div className="space-y-1">
              {units.map((unit) => {
                const meta = UNITS[unit];
                const isSelected = selectedUnits.includes(unit);

                return (
                  <label
                    key={unit}
                    className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 hover:bg-accent"
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onToggleUnit(unit)}
                    />
                    <span className="text-sm">
                      {meta?.label ?? unit}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      ({meta?.short ?? unit})
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

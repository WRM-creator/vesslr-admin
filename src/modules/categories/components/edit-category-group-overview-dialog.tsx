import { Thumbnail } from "@/components/shared/thumbnail";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useFileUpload } from "@/hooks/use-file-upload";
import { api } from "@/lib/api";
import type { CategoryGroupDto } from "@/lib/api/generated/types.gen";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["products", "services"]),
  isActive: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditCategoryGroupOverviewDialogProps {
  categoryGroup: CategoryGroupDto;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditCategoryGroupOverviewDialog({
  categoryGroup,
  open,
  onOpenChange,
}: EditCategoryGroupOverviewDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null | undefined>(
    categoryGroup.image,
  );
  const { uploadFiles, isUploading } = useFileUpload();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "products",
      isActive: true,
    },
  });

  useEffect(() => {
    form.reset({
      name: categoryGroup.name,
      type: categoryGroup.type as "products" | "services",
      isActive: categoryGroup.isActive,
    });
    setImageUrl(categoryGroup.image);
  }, [categoryGroup, form]);

  const { mutate: updateCategoryGroup, isPending } =
    api.categoryGroups.update.useMutation({
      onSuccess: () => {
        toast.success("Category group updated successfully");
        onOpenChange(false);
      },
      onError: () => {
        toast.error("Failed to update category group");
      },
    });

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

  function onSubmit(values: FormValues) {
    updateCategoryGroup({
      path: { id: categoryGroup._id },
      body: { ...values, image: imageUrl ?? undefined },
    });
  }

  const isBusy = isPending || isUploading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Category Group</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  {isUploading ? "Uploading..." : "Change image"}
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
                    <Input placeholder="e.g. Drilling Equipment" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="products">
                        Products
                      </SelectItem>
                      <SelectItem value="services">Services</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <FormLabel>Active</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isBusy}>
                {isPending ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

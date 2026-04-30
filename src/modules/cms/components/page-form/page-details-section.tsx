import {
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useRef } from "react";
import {
  type Control,
  type UseFormSetValue,
  type UseFormWatch,
} from "react-hook-form";
import { slugify, type CmsPageFormValues } from "../../lib/schemas";

interface PageDetailsSectionProps {
  control: Control<CmsPageFormValues>;
  setValue: UseFormSetValue<CmsPageFormValues>;
  watch: UseFormWatch<CmsPageFormValues>;
  isEditing: boolean;
}

export function PageDetailsSection({
  control,
  setValue,
  watch,
  isEditing,
}: PageDetailsSectionProps) {
  const slugTouched = useRef(isEditing);
  const title = watch("title");

  useEffect(() => {
    if (!slugTouched.current && title) {
      setValue("slug", slugify(title), { shouldValidate: true });
    }
  }, [title, setValue]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Page Details</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <FormField
          control={control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Page title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input
                  placeholder="page-slug"
                  className="font-mono"
                  {...field}
                  onChange={(e) => {
                    slugTouched.current = true;
                    field.onChange(e);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}

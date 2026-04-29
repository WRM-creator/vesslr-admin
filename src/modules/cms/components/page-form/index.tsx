import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import {
  cmsPageFormSchema,
  type CmsPageFormValues,
} from "../../lib/schemas";
import { BlocksSection } from "./blocks-section";
import { PageDetailsSection } from "./page-details-section";
import { SeoMetaSection } from "./seo-meta-section";

interface PageFormProps {
  initialValues?: CmsPageFormValues;
  isEditing: boolean;
  isLoading: boolean;
  onSubmit: (values: CmsPageFormValues) => void;
  onCancel: () => void;
}

export function PageForm({
  initialValues,
  isEditing,
  isLoading,
  onSubmit,
  onCancel,
}: PageFormProps) {
  const form = useForm<CmsPageFormValues>({
    resolver: zodResolver(cmsPageFormSchema) as any,
    defaultValues: initialValues ?? {
      title: "",
      slug: "",
      status: "draft",
      meta: { title: "", description: "", keywords: [] },
      blocks: [],
    },
  });

  const blocksFieldArray = useFieldArray({
    control: form.control,
    name: "blocks",
  });

  // Reset form when initialValues change (edit mode data loaded)
  useEffect(() => {
    if (initialValues) {
      form.reset(initialValues);
    }
  }, [initialValues, form]);

  return (
    <Form {...form}>
      <form
        id="cms-page-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-3xl space-y-6"
      >
        <PageDetailsSection
          control={form.control}
          setValue={form.setValue}
          watch={form.watch}
          isEditing={isEditing}
        />
        <SeoMetaSection control={form.control} />
        <BlocksSection
          control={form.control}
          fieldArray={blocksFieldArray}
          setValue={form.setValue}
        />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading || !form.formState.isDirty}>
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

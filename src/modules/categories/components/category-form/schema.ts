import { z } from "zod";

export const categoryFormSchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().optional(),
});

export type CategoryFormSchema = z.infer<typeof categoryFormSchema>;

export const defaultCategoryFormValues: CategoryFormSchema = {
  name: "",
  description: "",
};

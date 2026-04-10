import { z } from "zod";
import { ALL_UNIT_VALUES } from "@/types/unit";

export const categoryFormSchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().optional(),
  image: z.string().optional(),
  allowedUnits: z.array(z.string().refine((v) => ALL_UNIT_VALUES.includes(v))),
});

export type CategoryFormSchema = z.infer<typeof categoryFormSchema>;

export const defaultCategoryFormValues: CategoryFormSchema = {
  name: "",
  description: "",
  image: "",
  allowedUnits: [],
};

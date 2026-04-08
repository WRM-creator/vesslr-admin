import { z } from "zod";

const MEASUREMENT_TYPES = ["count", "volume", "mass", "time"] as const;

export const categoryFormSchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().optional(),
  image: z.string().optional(),
  allowedMeasurementTypes: z
    .array(z.enum(MEASUREMENT_TYPES))
    .optional()
    .default([]),
});

export type CategoryFormSchema = z.infer<typeof categoryFormSchema>;

export const defaultCategoryFormValues: CategoryFormSchema = {
  name: "",
  description: "",
  image: "",
  allowedMeasurementTypes: [],
};

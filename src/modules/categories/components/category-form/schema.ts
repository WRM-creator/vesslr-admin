import { z } from "zod";
import { ALL_UNIT_VALUES } from "@/types/unit";

const DOCUMENT_TYPES = [
  "INVOICE",
  "PACKING_LIST",
  "CERTIFICATE_OF_ORIGIN",
  "SAFETY_DATA_SHEET",
  "BILL_OF_LADING",
  "CONTRACT",
  "INSPECTION_CERTIFICATE",
  "OTHER",
] as const;

const DOCUMENT_REQUIRED_FROM = ["BUYER", "SELLER"] as const;

const RISK_LEVELS = ["LOW", "MEDIUM", "HIGH"] as const;

const ESCROW_STRUCTURES = ["full", "deposit", "milestone", "partial"] as const;

export const documentTemplateSchema = z.object({
  type: z.enum(DOCUMENT_TYPES),
  name: z.string().min(1, "Document name is required"),
  requiredFrom: z.enum(DOCUMENT_REQUIRED_FROM),
  isMandatory: z.boolean(),
  requiredAtStatus: z.string().optional(),
});

export const complianceSchema = z.object({
  isHazardous: z.boolean(),
  isRegulated: z.boolean(),
  riskLevel: z.enum(RISK_LEVELS),
});

export const policyOverridesSchema = z
  .object({
    requiresLogistics: z.boolean().nullable().optional(),
    allowsInspection: z.boolean().nullable().optional(),
    milestoneDelivery: z.boolean().nullable().optional(),
    allowedEscrowStructures: z
      .array(z.enum(ESCROW_STRUCTURES))
      .nullable()
      .optional(),
    defaultEscrowStructure: z.enum(ESCROW_STRUCTURES).nullable().optional(),
  })
  .nullable()
  .optional();

export const categoryFormSchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().optional(),
  image: z.string().optional(),
  allowedUnits: z.array(z.string().refine((v) => ALL_UNIT_VALUES.includes(v))),
  requiredDocuments: z.array(documentTemplateSchema),
  compliance: complianceSchema,
  policyOverrides: policyOverridesSchema,
});

export type CategoryFormSchema = z.infer<typeof categoryFormSchema>;
export type DocumentTemplateFormValues = z.infer<typeof documentTemplateSchema>;

export const defaultCategoryFormValues: CategoryFormSchema = {
  name: "",
  description: "",
  image: "",
  allowedUnits: [],
  requiredDocuments: [],
  compliance: {
    isHazardous: false,
    isRegulated: false,
    riskLevel: "LOW",
  },
  policyOverrides: null,
};

export { DOCUMENT_TYPES, DOCUMENT_REQUIRED_FROM, RISK_LEVELS, ESCROW_STRUCTURES };

import { z } from "zod";

// -- Block data schemas --

const heroBlockDataSchema = z.object({
  heading: z.string().min(1, "Heading is required"),
  subtitle: z.string().optional().default(""),
  ctaText: z.string().optional().default(""),
  ctaUrl: z.string().optional().default(""),
  image: z.string().optional().default(""),
  logoBarTitle: z.string().optional().default(""),
});

const textBlockDataSchema = z.object({
  heading: z.string().optional().default(""),
  body: z.string().min(1, "Body text is required"),
});

const markdownBlockDataSchema = z.object({
  content: z.string().min(1, "Content is required"),
});

const featuresBlockDataSchema = z.object({
  sectionLabel: z.string().optional().default(""),
  heading: z.string().optional().default(""),
  subtitle: z.string().optional().default(""),
  items: z
    .array(
      z.object({
        icon: z.string().optional().default(""),
        title: z.string().min(1, "Title is required"),
        description: z.string().optional().default(""),
      }),
    )
    .min(1, "At least one feature is required"),
});

const ctaBlockDataSchema = z.object({
  heading: z.string().min(1, "Heading is required"),
  body: z.string().optional().default(""),
  buttonLabel: z.string().min(1, "Button label is required"),
  buttonUrl: z.string().min(1, "Button URL is required"),
});

const faqBlockDataSchema = z.object({
  heading: z.string().optional().default(""),
  subtitle: z.string().optional().default(""),
  items: z
    .array(
      z.object({
        question: z.string().min(1, "Question is required"),
        answer: z.string().min(1, "Answer is required"),
      }),
    )
    .min(1, "At least one FAQ item is required"),
});

const stepsBlockDataSchema = z.object({
  heading: z.string().optional().default(""),
  items: z
    .array(
      z.object({
        title: z.string().min(1, "Title is required"),
        description: z.string().optional().default(""),
        ctaText: z.string().optional().default(""),
        ctaUrl: z.string().optional().default(""),
      }),
    )
    .min(1, "At least one step is required"),
});

const tabsBlockDataSchema = z.object({
  label: z.string().optional().default(""),
  heading: z.string().optional().default(""),
  tabs: z
    .array(
      z.object({
        title: z.string().min(1, "Title is required"),
        content: z.string().optional().default(""),
      }),
    )
    .min(1, "At least one tab is required"),
});

const testimonialsBlockDataSchema = z.object({
  label: z.string().optional().default(""),
  heading: z.string().optional().default(""),
  items: z
    .array(
      z.object({
        text: z.string().min(1, "Testimonial text is required"),
        person: z.string().min(1, "Person name is required"),
        role: z.string().optional().default(""),
      }),
    )
    .min(1, "At least one testimonial is required"),
});

const legalSectionsBlockDataSchema = z.object({
  effectiveDate: z.string().optional().default(""),
  sections: z
    .array(
      z.object({
        title: z.string().min(1, "Section title is required"),
        content: z.string().min(1, "Section content is required"),
      }),
    )
    .min(1, "At least one section is required"),
});

// -- Page form schema --

const contentBlockSchema = z.object({
  type: z.enum(["hero", "text", "markdown", "features", "cta", "faq", "steps", "tabs", "testimonials", "legal-sections"]),
  order: z.number().int().min(0),
  data: z.record(z.string(), z.any()),
});

const pageMetaSchema = z.object({
  title: z.string().optional().default(""),
  description: z.string().optional().default(""),
  keywords: z.array(z.string()).optional().default([]),
});

export const cmsPageFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Lowercase alphanumeric with hyphens only",
    ),
  status: z.enum(["draft", "published"]).default("draft"),
  meta: pageMetaSchema.optional().default({ title: "", description: "", keywords: [] }),
  blocks: z.array(contentBlockSchema).default([]),
});

export type CmsPageFormValues = z.infer<typeof cmsPageFormSchema>;

export const BLOCK_TYPES = [
  { value: "hero", label: "Hero" },
  { value: "text", label: "Text" },
  { value: "markdown", label: "Markdown" },
  { value: "features", label: "Features" },
  { value: "cta", label: "Call to Action" },
  { value: "faq", label: "FAQ" },
  { value: "steps", label: "Steps" },
  { value: "tabs", label: "Tabs" },
  { value: "testimonials", label: "Testimonials" },
  { value: "legal-sections", label: "Legal Sections" },
] as const;

export type BlockType = (typeof BLOCK_TYPES)[number]["value"];

export const blockDataSchemas: Record<BlockType, z.ZodType> = {
  hero: heroBlockDataSchema,
  text: textBlockDataSchema,
  markdown: markdownBlockDataSchema,
  features: featuresBlockDataSchema,
  cta: ctaBlockDataSchema,
  faq: faqBlockDataSchema,
  steps: stepsBlockDataSchema,
  tabs: tabsBlockDataSchema,
  testimonials: testimonialsBlockDataSchema,
  "legal-sections": legalSectionsBlockDataSchema,
};

export const defaultBlockData: Record<BlockType, Record<string, any>> = {
  hero: { heading: "", subtitle: "", ctaText: "", ctaUrl: "", image: "", logoBarTitle: "" },
  text: { heading: "", body: "" },
  markdown: { content: "" },
  features: {
    sectionLabel: "",
    heading: "",
    subtitle: "",
    items: [{ icon: "", title: "", description: "" }],
  },
  cta: { heading: "", body: "", buttonLabel: "", buttonUrl: "" },
  faq: { heading: "", subtitle: "", items: [{ question: "", answer: "" }] },
  steps: { heading: "", items: [{ title: "", description: "", ctaText: "", ctaUrl: "" }] },
  tabs: { label: "", heading: "", tabs: [{ title: "", content: "" }] },
  testimonials: { label: "", heading: "", items: [{ text: "", person: "", role: "" }] },
  "legal-sections": { effectiveDate: "", sections: [{ title: "", content: "" }] },
};

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

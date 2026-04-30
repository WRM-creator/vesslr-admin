import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Control } from "react-hook-form";
import type { CmsPageFormValues } from "../../lib/schemas";

interface HeroBlockEditorProps {
  index: number;
  control: Control<CmsPageFormValues>;
}

export function HeroBlockEditor({ index, control }: HeroBlockEditorProps) {
  return (
    <div className="grid gap-4">
      <FormField
        control={control}
        name={`blocks.${index}.data.heading`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Heading</FormLabel>
            <FormControl>
              <Input placeholder="Main heading text" {...field} value={(field.value as string) ?? ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`blocks.${index}.data.subtitle`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Subtitle</FormLabel>
            <FormControl>
              <Input placeholder="Supporting text" {...field} value={(field.value as string) ?? ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name={`blocks.${index}.data.ctaText`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>CTA Text</FormLabel>
              <FormControl>
                <Input placeholder="Get Started" {...field} value={(field.value as string) ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`blocks.${index}.data.ctaUrl`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>CTA URL</FormLabel>
              <FormControl>
                <Input placeholder="/signup" {...field} value={(field.value as string) ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={control}
        name={`blocks.${index}.data.image`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Image URL</FormLabel>
            <FormControl>
              <Input placeholder="https://..." {...field} value={(field.value as string) ?? ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`blocks.${index}.data.logoBarTitle`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Logo Bar Title</FormLabel>
            <FormControl>
              <Input placeholder="Backed by over 150 top companies" {...field} value={(field.value as string) ?? ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

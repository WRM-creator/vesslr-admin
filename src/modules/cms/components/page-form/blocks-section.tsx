import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ArrowDown, ArrowUp, ChevronDown, Plus, Trash2 } from "lucide-react";
import { useState, useCallback } from "react";
import type { Control, UseFieldArrayReturn, UseFormSetValue } from "react-hook-form";
import {
  BLOCK_TYPES,
  defaultBlockData,
  type BlockType,
  type CmsPageFormValues,
} from "../../lib/schemas";
import { HeroBlockEditor } from "../block-editors/hero-block-editor";
import { TextBlockEditor } from "../block-editors/text-block-editor";
import { MarkdownBlockEditor } from "../block-editors/markdown-block-editor";
import { FeaturesBlockEditor } from "../block-editors/features-block-editor";
import { CtaBlockEditor } from "../block-editors/cta-block-editor";
import { FaqBlockEditor } from "../block-editors/faq-block-editor";
import { StepsBlockEditor } from "../block-editors/steps-block-editor";
import { TabsBlockEditor } from "../block-editors/tabs-block-editor";
import { TestimonialsBlockEditor } from "../block-editors/testimonials-block-editor";

interface BlocksSectionProps {
  control: Control<CmsPageFormValues>;
  fieldArray: UseFieldArrayReturn<CmsPageFormValues, "blocks">;
  setValue: UseFormSetValue<CmsPageFormValues>;
}

const blockEditors: Record<
  BlockType,
  React.ComponentType<{ index: number; control: Control<CmsPageFormValues> }>
> = {
  hero: HeroBlockEditor,
  text: TextBlockEditor,
  markdown: MarkdownBlockEditor,
  features: FeaturesBlockEditor,
  cta: CtaBlockEditor,
  faq: FaqBlockEditor,
  steps: StepsBlockEditor,
  tabs: TabsBlockEditor,
  testimonials: TestimonialsBlockEditor,
};

function getBlockLabel(type: string): string {
  return BLOCK_TYPES.find((b) => b.value === type)?.label ?? type;
}

export function BlocksSection({
  control,
  fieldArray,
  setValue,
}: BlocksSectionProps) {
  const { fields, append, remove, move } = fieldArray;
  const [expandedBlocks, setExpandedBlocks] = useState<Record<number, boolean>>({});

  const toggleBlock = useCallback((index: number, open: boolean) => {
    setExpandedBlocks((prev) => ({ ...prev, [index]: open }));
  }, []);

  const addBlock = (type: BlockType) => {
    append({
      type,
      order: fields.length,
      data: { ...defaultBlockData[type] },
    });
  };

  const moveBlock = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= fields.length) return;
    move(index, newIndex);
    // Swap expanded state to follow the blocks
    setExpandedBlocks((prev) => {
      const next = { ...prev };
      const tmp = next[index];
      next[index] = next[newIndex];
      next[newIndex] = tmp;
      return next;
    });
    // Recalculate order values
    fields.forEach((_, i) => {
      setValue(`blocks.${i}.order`, i);
    });
  };

  const removeBlock = (index: number) => {
    remove(index);
    // Shift expanded state down for indices above the removed block
    setExpandedBlocks((prev) => {
      const next: Record<number, boolean> = {};
      for (const [key, value] of Object.entries(prev)) {
        const k = Number(key);
        if (k < index) next[k] = value;
        else if (k > index) next[k - 1] = value;
      }
      return next;
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Content Blocks</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="outline" size="sm">
                <Plus className="mr-1 h-3 w-3" />
                Add Block
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {BLOCK_TYPES.map((bt) => (
                <DropdownMenuItem
                  key={bt.value}
                  onClick={() => addBlock(bt.value)}
                >
                  {bt.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.length === 0 && (
          <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
            <p className="text-muted-foreground text-sm">
              No blocks yet. Add one to get started.
            </p>
          </div>
        )}

        {fields.map((field, index) => {
          const BlockEditor = blockEditors[field.type as BlockType];
          return (
            <Collapsible key={field.id} open={!!expandedBlocks[index]} onOpenChange={(open) => toggleBlock(index, open)}>
              <Card>
                <CardHeader className="py-3">
                  <div className="flex items-center justify-between">
                    <CollapsibleTrigger asChild>
                      <button
                        type="button"
                        className="flex items-center gap-2 hover:opacity-70 transition-opacity"
                      >
                        <ChevronDown className="h-3.5 w-3.5 transition-transform [[data-state=closed]_&]:rotate-[-90deg]" />
                        <span className="bg-muted text-muted-foreground rounded px-2 py-0.5 text-xs font-medium">
                          {getBlockLabel(field.type)}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          Block {index + 1}
                        </span>
                      </button>
                    </CollapsibleTrigger>
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        disabled={index === 0}
                        onClick={() => moveBlock(index, "up")}
                      >
                        <ArrowUp className="h-3 w-3" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        disabled={index === fields.length - 1}
                        onClick={() => moveBlock(index, "down")}
                      >
                        <ArrowDown className="h-3 w-3" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-destructive"
                        onClick={() => removeBlock(index)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CollapsibleContent>
                  <CardContent>
                    {BlockEditor && (
                      <BlockEditor index={index} control={control} />
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          );
        })}
      </CardContent>
    </Card>
  );
}

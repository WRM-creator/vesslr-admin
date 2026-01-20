import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

interface Section {
  value: string;
  title: string;
}

interface CategoryPageNavigationProps {
  sections: Section[];
  className?: string;
  onNavigate: (value: string) => void;
}

export function CategoryPageNavigation({ sections, className, onNavigate }: CategoryPageNavigationProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -60% 0px",
      }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.value);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      sections.forEach((section) => {
        const element = document.getElementById(section.value);
        if (element) element.id && observer.unobserve(element);
      });
    };
  }, [sections]);

  return (
    <div className={cn("sticky top-8 h-fit space-y-4", className)}>
      <div className="space-y-1">
        {sections.map((section) => (
          <button
            key={section.value}
            onClick={() => onNavigate(section.value)}
            className={cn(
              "group flex items-center justify-between w-full text-sm text-left px-2 py-1.5 rounded-md transition-colors",
              activeSection === section.value 
                ? "bg-accent text-accent-foreground font-medium" 
                : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
            )}
          >
            <span className="truncate">{section.title}</span>
            {activeSection === section.value && (
                <ChevronRight className="h-4 w-4 opacity-50" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

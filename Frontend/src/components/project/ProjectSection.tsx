import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ProjectSectionProps {
  title?: string;
  icon?: ElementType;
  /** Trailing content on the header row (e.g. a count chip or link). */
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Renders the section without the card chrome (used for the hero). */
  bare?: boolean;
}

/**
 * Unified section wrapper for the Project Details page — one card language:
 * `rounded-2xl border bg-card shadow-sm`, consistent padding + header.
 */
export function ProjectSection({
  title,
  icon: Icon,
  action,
  children,
  className,
  bare = false,
}: ProjectSectionProps) {
  return (
    <section
      className={cn(
        !bare && "rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6",
        className,
      )}
    >
      {(title || action) && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-5 w-5 text-primary" />}
            {title && (
              <h2 className="font-display text-lg font-semibold text-foreground">
                {title}
              </h2>
            )}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

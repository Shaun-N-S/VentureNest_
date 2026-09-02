import { Quote, Target } from "lucide-react";
import { ProjectSection } from "./ProjectSection";

interface Props {
  vision: string;
}

export function ProjectVision({ vision }: Props) {
  return (
    <ProjectSection title="Our Vision" icon={Target}>
      <blockquote className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-secondary/70 to-muted/40 p-6 sm:p-8">
        <Quote
          className="absolute -left-1 -top-1 h-12 w-12 text-primary/10"
          aria-hidden
        />
        <p className="relative font-display text-lg leading-relaxed text-foreground/90 sm:text-xl sm:leading-relaxed">
          {vision}
        </p>
      </blockquote>
    </ProjectSection>
  );
}

import { Download, FileText, Globe } from "lucide-react";
import { ProjectSection } from "./ProjectSection";

interface Props {
  pitchDeckUrl?: string;
  projectWebsite?: string;
}

const fileTypeFromUrl = (url: string) => {
  const clean = url.split("?")[0] ?? "";
  const ext = clean.split(".").pop() ?? "";
  return /^[a-z0-9]{2,5}$/i.test(ext) ? ext.toUpperCase() : "PDF";
};

export function ProjectPitchDeck({ pitchDeckUrl, projectWebsite }: Props) {
  if (!pitchDeckUrl && !projectWebsite) return null;

  return (
    <ProjectSection title="Resources" icon={FileText}>
      <div className="grid gap-3 sm:grid-cols-2">
        {pitchDeckUrl && (
          <a
            href={pitchDeckUrl}
            download
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-4 rounded-xl border border-border bg-secondary/40 p-4 transition-colors hover:border-primary/40 hover:bg-secondary"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FileText className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-foreground">
                Pitch Deck
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {fileTypeFromUrl(pitchDeckUrl)} · Click to download
              </p>
            </div>
            <Download className="h-5 w-5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
          </a>
        )}

        {projectWebsite && (
          <a
            href={projectWebsite}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-4 rounded-xl border border-border bg-secondary/40 p-4 transition-colors hover:border-primary/40 hover:bg-secondary"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Globe className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-foreground">Website</p>
              <p className="truncate text-xs text-muted-foreground">
                {projectWebsite.replace(/^https?:\/\//, "")}
              </p>
            </div>
          </a>
        )}
      </div>
    </ProjectSection>
  );
}

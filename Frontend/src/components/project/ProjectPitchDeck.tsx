import { useState } from "react";
import { Download, FileText, Globe, Loader2 } from "lucide-react";
import { Document, Page } from "react-pdf";
import { ProjectSection } from "./ProjectSection";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";

interface Props {
  pitchDeckUrl?: string;
  projectWebsite?: string;
  /**
   * pitchDeckUrl is an S3 presigned URL with a short expiry (see
   * CONFIG.SIGNED_URL_EXPIRY on the backend). It's signed once when the
   * project details query resolves, so if the user stays on the page past
   * that expiry and then opens the preview, react-pdf fetches an
   * already-expired URL and S3 rejects it. Passing the project query's
   * `refetch` here re-signs the URL immediately before the preview opens,
   * so the <Document> below never loads a stale one.
   */
  onBeforePreview?: () => Promise<unknown>;
}

const fileTypeFromUrl = (url: string) => {
  const clean = url.split("?")[0] ?? "";
  const ext = clean.split(".").pop() ?? "";
  return /^[a-z0-9]{2,5}$/i.test(ext) ? ext.toUpperCase() : "PDF";
};

export function ProjectPitchDeck({
  pitchDeckUrl,
  projectWebsite,
  onBeforePreview,
}: Props) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isPreparingPreview, setIsPreparingPreview] = useState(false);
  const [numPages, setNumPages] = useState<number | null>(null);

  if (!pitchDeckUrl && !projectWebsite) return null;

  const onDocumentLoadSuccess = (pdf: { numPages: number }) => {
    console.log("PDF loaded successfully", pdf);
    setNumPages(pdf.numPages);
  };

  const handleOpenPreview = async () => {
    if (!onBeforePreview) {
      setIsPreviewOpen(true);
      return;
    }

    setIsPreparingPreview(true);
    try {
      await onBeforePreview();
    } finally {
      setIsPreparingPreview(false);
      setIsPreviewOpen(true);
    }
  };

  console.log("Pitch Deck URL:", pitchDeckUrl);

  return (
    <ProjectSection title="Resources" icon={FileText}>
      <div className="grid gap-3 sm:grid-cols-2">
        {pitchDeckUrl && (
          <button
            type="button"
            onClick={handleOpenPreview}
            disabled={isPreparingPreview}
            className="group flex items-center gap-4 rounded-xl border border-border bg-secondary/40 p-4 text-left transition-colors hover:border-primary/40 hover:bg-secondary disabled:opacity-60"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FileText className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-foreground">
                Pitch Deck
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {fileTypeFromUrl(pitchDeckUrl)} · Click to preview
              </p>
            </div>
            {isPreparingPreview ? (
              <Loader2 className="h-5 w-5 shrink-0 animate-spin text-muted-foreground" />
            ) : (
              <FileText className="h-5 w-5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
            )}
          </button>
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

      {pitchDeckUrl && (
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="flex h-[90vh] max-w-4xl flex-col overflow-hidden">
            <DialogHeader className="flex-shrink-0">
              <div className="flex items-center justify-between gap-4 pr-8">
                <DialogTitle className="font-display text-xl">
                  Pitch Deck Preview
                </DialogTitle>
                <Button variant="outline" size="sm" asChild className="gap-2">
                  <a href={pitchDeckUrl} download>
                    <Download className="h-4 w-4" />
                    Download
                  </a>
                </Button>
              </div>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto rounded-xl bg-muted/50 p-4">
              <Document
                file={pitchDeckUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={(error) => {
                  console.error("PDF Load Error:", error);
                }}
                onSourceError={(error) => {
                  console.error("PDF Source Error:", error);
                }}
                className="flex flex-col items-center gap-4"
              >
                {Array.from(new Array(numPages || 0), (_, idx) => (
                  <Page
                    key={idx + 1}
                    pageNumber={idx + 1}
                    scale={1.2}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    className="overflow-hidden rounded-lg shadow-md"
                  />
                ))}
              </Document>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </ProjectSection>
  );
}

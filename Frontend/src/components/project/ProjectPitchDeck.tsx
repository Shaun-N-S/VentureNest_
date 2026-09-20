import { useEffect, useState } from "react";
import {
  AlertTriangle,
  FileText,
  Globe,
  Loader2,
  RotateCw,
  X,
} from "lucide-react";
import { Document, Page } from "react-pdf";
import toast from "react-hot-toast";
import { ProjectSection } from "./ProjectSection";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";

interface Props {
  pitchDeckUrl?: string;
  projectWebsite?: string;
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
  const [loadError, setLoadError] = useState(false);
  const [pageWidth, setPageWidth] = useState(0);
  const [pageContainer, setPageContainer] = useState<HTMLDivElement | null>(
    null,
  );

  useEffect(() => {
    if (!pageContainer) return;

    const updateWidth = () => setPageWidth(pageContainer.clientWidth);
    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(pageContainer);
    return () => observer.disconnect();
  }, [pageContainer]);

  if (!pitchDeckUrl && !projectWebsite) return null;

  const handleDialogOpenChange = (open: boolean) => {
    setIsPreviewOpen(open);
    if (!open) {
      setLoadError(false);
      setNumPages(null);
    }
  };

  const onDocumentLoadSuccess = (pdf: { numPages: number }) => {
    setLoadError(false);
    setNumPages(pdf.numPages);
  };

  const handleLoadFailure = (error: unknown) => {
    console.error("PDF Load Error:", error);
    setLoadError(true);
  };

  const handleOpenPreview = async () => {
    if (!onBeforePreview) {
      setLoadError(false);
      setIsPreviewOpen(true);
      return;
    }

    setIsPreparingPreview(true);
    try {
      await onBeforePreview();
      setLoadError(false);
      setIsPreviewOpen(true);
    } catch (error) {
      console.error("Failed to refresh pitch deck link:", error);
      toast.error("Couldn't load the pitch deck. Please try again.");
    } finally {
      setIsPreparingPreview(false);
    }
  };

  const handleRetryPreview = async () => {
    if (!onBeforePreview) {
      setLoadError(false);
      return;
    }

    setIsPreparingPreview(true);
    try {
      await onBeforePreview();
      setLoadError(false);
    } catch (error) {
      console.error("Failed to refresh pitch deck link:", error);
      toast.error("Couldn't refresh the pitch deck link. Please try again.");
    } finally {
      setIsPreparingPreview(false);
    }
  };

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
        <Dialog open={isPreviewOpen} onOpenChange={handleDialogOpenChange}>
          <DialogContent className="flex h-[100dvh] w-screen max-w-none flex-col gap-0 overflow-hidden rounded-none p-0 sm:h-[90vh] sm:w-[90vw] sm:max-w-[1000px] sm:rounded-lg">
            <DialogHeader className="flex-shrink-0 border-b p-4 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <DialogTitle className="font-display text-xl">
                  Pitch Deck Preview
                </DialogTitle>
                <button
                  type="button"
                  onClick={() => handleDialogOpenChange(false)}
                  aria-label="Close preview"
                  className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto overflow-x-hidden bg-muted/50 p-4">
              {loadError ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                  <AlertTriangle className="h-10 w-10 text-destructive" />
                  <p className="font-medium text-foreground">
                    We couldn't load the pitch deck
                  </p>
                  <p className="max-w-sm text-sm text-muted-foreground">
                    The preview link may have expired or the file couldn't be
                    reached. You can try again below.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRetryPreview}
                    disabled={isPreparingPreview}
                    className="gap-2"
                  >
                    {isPreparingPreview ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RotateCw className="h-4 w-4" />
                    )}
                    Try again
                  </Button>
                </div>
              ) : (
                <div ref={setPageContainer} className="mx-auto w-full max-w-full">
                  <Document
                    file={pitchDeckUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={handleLoadFailure}
                    onSourceError={handleLoadFailure}
                    className="flex flex-col items-center gap-4"
                  >
                    {Array.from(new Array(numPages || 0), (_, idx) => (
                      <Page
                        key={idx + 1}
                        pageNumber={idx + 1}
                        width={pageWidth || undefined}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        className="overflow-hidden rounded-lg shadow-md"
                      />
                    ))}
                  </Document>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </ProjectSection>
  );
}

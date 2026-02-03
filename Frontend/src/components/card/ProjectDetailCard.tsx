import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Flag,
  MapPin,
  FileText,
  ExternalLink,
  Users,
  Target,
  Sparkles,
  CalendarDays,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Document, Page } from "react-pdf";
import { Link } from "react-router-dom";

interface Founder {
  id: string;
  name: string;
  image: string;
  initials: string;
  userRole: string;
}

interface ProjectDetailCardProps {
  id: string;
  name: string;
  stage: string;
  image: string;
  likes: number;
  isLiked?: boolean;
  logo: string;
  logoAlt?: string;
  founders: Founder[];
  aim: string;
  pitchDeckUrl?: string;
  pitchDeckName?: string;
  location?: string;
  onLike?: (id: string) => void;
  isLikeLoading?: boolean;
  onReport?: (id: string) => void;
  showScheduleButton?: boolean;
}

const stageColors: Record<string, string> = {
  Idea: "bg-accent/10 text-accent border-accent/20",
  MVP: "bg-primary/10 text-primary border-primary/20",
  Seed: "bg-success/10 text-success border-success/20",
  "Series A": "bg-primary/10 text-primary border-primary/20",
  Growth: "bg-success/10 text-success border-success/20",
};

export function ProjectDetailCard({
  id,
  name,
  stage,
  image,
  logo,
  logoAlt,
  founders,
  aim,
  pitchDeckUrl,
  pitchDeckName,
  location,
  onReport,
  showScheduleButton,
}: ProjectDetailCardProps) {
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [numPages, setNumPages] = useState<number | null>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const stageClass =
    stageColors[stage] || "bg-muted text-muted-foreground border-border";

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="bg-card rounded-2xl overflow-hidden shadow-lg border border-border/50"
      >
        {/* Hero Image Section */}
        <div className="relative h-72 md:h-96 overflow-hidden group">
          <motion.img
            src={image}
            alt={name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />

          {/* Floating Like Button */}
          {/* <motion.button
            whileHover={!isLikeLoading ? { scale: 1.1 } : undefined}
            whileTap={!isLikeLoading ? { scale: 0.9 } : undefined}
            onClick={handleLike}
            disabled={isLikeLoading}
            className={`absolute top-6 right-6 p-3 rounded-full
    ${isLikeLoading ? "opacity-50 cursor-not-allowed" : ""}
  `}
          >
            <Heart
              className={`w-6 h-6 transition-colors ${
                isLiked
                  ? "fill-destructive text-destructive"
                  : "text-muted-foreground"
              }`}
            />
            <span className="text-lg font-bold text-foreground">{likes}</span>
          </motion.button> */}
        </div>

        <div className="relative z-20 -mt-16 ml-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-white shadow-lg border-4 border-white overflow-hidden flex items-center justify-center"
          >
            <img
              src={logo || "/placeholder.svg"}
              alt={logoAlt || name}
              className="w-full h-full object-contain"
            />
          </motion.div>
        </div>

        {/* Content Section */}
        <div className="pt-40 md:pt-2 px-6 pb-8 md:px-8">
          {/* Header */}
          <div className="flex flex-col gap-3 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* LEFT SIDE */}
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                  {name}
                </h1>

                <Badge
                  variant="outline"
                  className={`${stageClass} font-medium`}
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  {stage}
                </Badge>
              </div>

              {/* RIGHT SIDE */}
              {showScheduleButton && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button className="gap-2 rounded-xl px-6 py-2" asChild>
                    <Link to={`/investor/schedule-session/${id}`}>
                      <CalendarDays className="w-4 h-4" />
                      Schedule Session
                    </Link>
                  </Button>
                </motion.div>
              )}
            </div>

            {/* Location */}
            {location && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">{location}</span>
              </div>
            )}
          </div>

          {/* Founders Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="section-divider"
          >
            <div className="flex items-center gap-2 mb-5">
              <Users className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-display font-semibold text-foreground">
                Founders
              </h2>
            </div>

            <div className="grid gap-3">
              {founders.map((founder, index) => (
                <motion.div
                  key={founder.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-secondary/50 rounded-xl hover:bg-secondary transition-colors cursor-pointer group"
                >
                  <Avatar className="w-14 h-14 ring-2 ring-primary/10 ring-offset-2 ring-offset-card">
                    <AvatarImage
                      src={founder.image || "/placeholder.svg"}
                      alt={founder.name}
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                      {founder.initials}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {founder.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {founder.userRole}
                    </p>
                  </div>

                  <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Aim Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="section-divider"
          >
            <div className="flex items-center gap-2 mb-5">
              <Target className="w-5 h-5 text-accent" />
              <h2 className="text-xl font-display font-semibold text-foreground">
                Our Vision
              </h2>
            </div>
            <div className="relative p-6 bg-gradient-to-br from-secondary/80 to-muted/50 rounded-2xl border border-border/50">
              <p className="text-foreground/90 leading-relaxed text-base md:text-lg italic font-display">
                "{aim}"
              </p>
            </div>
          </motion.section>

          {/* Pitch Deck Section */}
          {pitchDeckUrl && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="section-divider"
            >
              <div className="flex items-center gap-2 mb-5">
                <FileText className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-display font-semibold text-foreground">
                  Pitch Deck
                </h2>
              </div>

              <div className="grid sm:grid-cols-1 gap-3">
                {/* <Button
                                    variant="outline"
                                    onClick={() => setIsPdfOpen(true)}
                                    className="h-auto py-4 px-5 justify-start gap-3 bg-secondary/30 hover:bg-secondary border-border/50"
                                >
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <FileText className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-semibold text-foreground">View Deck</p>
                                        <p className="text-xs text-muted-foreground">Preview in browser</p>
                                    </div>
                                </Button> */}

                <Button
                  variant="outline"
                  asChild
                  className="h-auto py-4 px-5 justify-start gap-3 bg-secondary/30 hover:bg-secondary border-border/50"
                >
                  <a href={pitchDeckUrl} download>
                    <div className="p-2 bg-success/10 rounded-lg">
                      <Download className="w-5 h-5 text-success" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-foreground">Download</p>
                      <p className="text-xs text-muted-foreground">
                        {pitchDeckName || "PDF File"}
                      </p>
                    </div>
                  </a>
                </Button>
              </div>
            </motion.section>
          )}

          {/* Report Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Button
              variant="ghost"
              onClick={() => onReport?.(id)}
              className="w-full mt-5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 gap-2"
            >
              <Flag className="w-4 h-4" />
              Report this project
            </Button>
          </motion.div>
        </div>
      </motion.article>

      {/* PDF Viewer Modal */}
      <AnimatePresence>
        <Dialog open={isPdfOpen} onOpenChange={setIsPdfOpen}>
          <DialogContent className="max-w-4xl h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle className="font-display text-xl">
                {pitchDeckName || "Pitch Deck"} Preview
              </DialogTitle>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto bg-muted/50 rounded-xl p-4">
              {pitchDeckUrl ? (
                <Document
                  file={pitchDeckUrl}
                  onLoadSuccess={onDocumentLoadSuccess}
                  className="flex flex-col items-center gap-4"
                >
                  {Array.from(new Array(numPages || 0), (_, idx) => (
                    <Page
                      key={idx + 1}
                      pageNumber={idx + 1}
                      scale={1.2}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      className="shadow-md rounded-lg overflow-hidden"
                    />
                  ))}
                </Document>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No PDF available
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </AnimatePresence>
    </>
  );
}

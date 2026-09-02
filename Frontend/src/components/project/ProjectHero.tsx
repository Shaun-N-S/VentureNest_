import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { CalendarDays, CalendarClock, Heart, MapPin } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { VerifiedBadge } from "../Comments/VerifiedBadge";

interface ProjectHeroProps {
  id: string;
  name: string;
  stage?: string;
  category?: string;
  teamSize?: string;
  coverImageUrl?: string;
  logoUrl?: string;
  location?: string;
  createdAt?: string;
  liked?: boolean;
  likeCount?: number;
  isVerified?: boolean;
  isRaising?: boolean;
  isOwner?: boolean;
  registrationStatus?: string | null;
  rejectionReason?: string | null;
  showSchedule?: boolean;
  canSave?: boolean;
  onLike: () => void;
  likeLoading?: boolean;
}

export function ProjectHero({
  id,
  name,
  stage,
  category,
  teamSize,
  coverImageUrl,
  logoUrl,
  location,
  createdAt,
  liked,
  likeCount = 0,
  isVerified,
  isRaising,
  isOwner,
  registrationStatus,
  rejectionReason,
  showSchedule,
  canSave = true,
  onLike,
  likeLoading,
}: ProjectHeroProps) {
  const listedOn = createdAt ? format(new Date(createdAt), "MMM yyyy") : null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
    >
      {/* Cover */}
      <div className="relative h-40 w-full overflow-hidden sm:h-52 md:h-60">
        {coverImageUrl ? (
          <img
            src={coverImageUrl}
            alt={name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-primary/15 via-accent/10 to-secondary" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />
      </div>

      <div className="px-5 pb-5 sm:px-6 sm:pb-6">
        {/* Logo overlaps the cover */}
        <div className="-mt-10 mb-4 sm:-mt-12">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border-4 border-card bg-white shadow-md sm:h-24 sm:w-24">
            <img
              src={logoUrl || "/placeholder.svg"}
              alt={`${name} logo`}
              className="h-full w-full object-contain"
            />
          </div>
        </div>

        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          {/* Left: identity */}
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <h1 className="font-display text-2xl font-bold break-words text-foreground sm:text-3xl">
                {name}
              </h1>
              {isVerified && <VerifiedBadge size={22} />}
              {stage && (
                <Badge variant="secondary" className="font-medium">
                  {stage}
                </Badge>
              )}
              {isRaising && (
                <Badge className="border-transparent bg-success/15 text-success">
                  Raising
                </Badge>
              )}
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              {location && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {location}
                </span>
              )}
              {listedOn && (
                <span className="inline-flex items-center gap-1.5">
                  <CalendarClock className="h-4 w-4" />
                  Listed {listedOn}
                </span>
              )}
            </div>

            {(category || teamSize) && (
              <div className="mt-3 flex flex-wrap gap-2">
                {category && (
                  <Badge variant="outline" className="font-normal">
                    {category}
                  </Badge>
                )}
                {teamSize && (
                  <Badge variant="outline" className="font-normal">
                    {teamSize}
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Right: CTAs */}
          <div className="flex flex-col gap-2.5 sm:flex-row md:flex-col md:items-end">
            {showSchedule && (
              <Button asChild className="w-full gap-2 rounded-xl sm:w-auto">
                <Link to={`/investor/schedule-session/${id}`}>
                  <CalendarDays className="h-4 w-4" />
                  Schedule Session
                </Link>
              </Button>
            )}
            {canSave && (
              <Button
                variant="outline"
                onClick={onLike}
                disabled={likeLoading}
                className="w-full gap-2 rounded-xl sm:w-auto"
              >
                <Heart
                  className={`h-4 w-4 ${liked ? "fill-destructive text-destructive" : ""}`}
                />
                {liked ? "Saved" : "Save"}
                <span className="text-muted-foreground">{likeCount}</span>
              </Button>
            )}
          </div>
        </div>

        {isOwner && registrationStatus === "REJECTED" && (
          <div className="mt-5 rounded-xl border border-destructive/30 bg-destructive/10 p-4">
            <p className="text-sm font-semibold text-destructive">
              Project verification was rejected
            </p>
            {rejectionReason && (
              <p className="mt-1 text-sm text-destructive/90">{rejectionReason}</p>
            )}
          </div>
        )}
      </div>
    </motion.section>
  );
}

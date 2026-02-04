import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  Building2,
  Users,
  ArrowRight,
  Video,
  Tag,
  ExternalLink,
  XCircle,
  X,
} from "lucide-react";
import type { SessionDTO, PersonDTO } from "../../types/session";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { useState } from "react";
import { useCancelSession } from "../../hooks/Session/sessionHooks";
import { useSelector } from "react-redux";
import type { Rootstate } from "../../store/store";
import RejectReasonModal from "./RejectReasonModal";

interface Props {
  open: boolean;
  onClose: () => void;
  session: SessionDTO;
  stage: string;
  project: {
    id: string;
    startupName: string;
    logoUrl?: string;
    location?: string;
  };
  founder: PersonDTO;
  investor: PersonDTO;
}

export function SessionDetailsModal({
  open,
  onClose,
  session,
  stage,
  project,
  founder,
  investor,
}: Props) {
  const navigate = useNavigate();
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const { mutate: cancelSession } = useCancelSession();
  const user = useSelector((state: Rootstate) => state.authData);
  const isUpcoming = session.status === "scheduled";
  const isScheduled = session.status === "scheduled";
  const isCompleted = session.status === "completed";
  const isCancelled = session.status === "cancelled";

  const date = new Date(session.date);
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const formattedTime = session.startTime
    ? new Date(session.startTime).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

  const getProfileRoute = (id: string, type: "FOUNDER" | "INVESTOR") => {
    if (type === "INVESTOR") {
      return `/investor/profile`;
    }
    return `/profile/${id}`;
  };

  const handleCancelSubmit = (reason: string) => {
    const cancelledBy = user.role === "INVESTOR" ? "INVESTOR" : "USER";

    cancelSession(
      {
        sessionId: session.id,
        cancelledBy,
        reason,
        userId: user.id,
      },
      {
        onSuccess: () => {
          setOpenCancelModal(false);
          onClose();
        },
      },
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl max-h-[95vh] sm:max-h-[90vh] p-0 gap-0 flex flex-col overflow-hidden">
          {/* HEADER SECTION WITH GRADIENT - Fixed */}
          <div className="flex-shrink-0 bg-gradient-to-br from-primary/10 via-primary/5 to-background p-4 sm:p-6 border-b">
            <DialogHeader>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 space-y-2 min-w-0">
                  <DialogTitle className="text-xl sm:text-2xl font-bold leading-tight pr-2">
                    {session.sessionName}
                  </DialogTitle>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      variant={isUpcoming ? "default" : "secondary"}
                      className={`${
                        isScheduled
                          ? "bg-primary text-primary-foreground"
                          : isCompleted
                            ? "bg-green-600 text-white"
                            : "bg-red-600 text-white"
                      }`}
                    >
                      {isScheduled
                        ? "Upcoming"
                        : isCompleted
                          ? "Completed"
                          : "Cancelled"}
                    </Badge>
                    <Separator
                      orientation="vertical"
                      className="h-4 hidden sm:block"
                    />
                    <Badge variant="outline" className="gap-1.5 shadow-sm">
                      <Tag className="w-3 h-3" />
                      {stage}
                    </Badge>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-full p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </DialogHeader>
          </div>

          {/* SCROLLABLE CONTENT - Flex grow */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
              {/* DATE & TIME CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="relative overflow-hidden rounded-xl border bg-card p-4 hover:shadow-lg transition-all duration-300">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 blur-2xl" />
                  <div className="relative space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="p-2.5 bg-primary/10 rounded-xl">
                        <Calendar className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-wider">
                        Date
                      </span>
                    </div>
                    <p className="font-bold text-base sm:text-lg leading-tight text-foreground">
                      {formattedDate}
                    </p>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-xl border bg-card p-4 hover:shadow-lg transition-all duration-300">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -mr-12 -mt-12 blur-2xl" />
                  <div className="relative space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="p-2.5 bg-blue-500/10 rounded-xl">
                        <Clock className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-wider">
                        Time
                      </span>
                    </div>
                    <p className="font-bold text-base sm:text-lg text-foreground">
                      {formattedTime}
                    </p>
                    <p className="text-xs text-muted-foreground font-medium">
                      {session.duration} minutes duration
                    </p>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />
              {isCancelled && session.cancelReason && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <p className="text-sm font-semibold text-red-700">
                      Session Cancelled
                    </p>
                  </div>

                  <p className="text-sm text-red-600 leading-relaxed">
                    <span className="font-medium">Reason:</span>{" "}
                    {session.cancelReason}
                  </p>
                </div>
              )}

              {/* PROJECT SECTION */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  <Building2 className="w-4 h-4" />
                  <span>Project</span>
                </div>

                <div
                  className="group relative overflow-hidden rounded-2xl border-2 bg-card hover:border-primary/30 hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => {
                    navigate(`/projects/${project.id}`);
                    onClose();
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="relative flex items-center gap-3 sm:gap-4 p-4 sm:p-5">
                    <Avatar className="h-14 w-14 sm:h-16 sm:w-16 ring-2 ring-background shadow-lg flex-shrink-0">
                      <AvatarImage
                        src={project.logoUrl}
                        alt={project.startupName}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground font-bold text-lg sm:text-xl">
                        {project.startupName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-base sm:text-lg group-hover:text-primary transition-colors line-clamp-1">
                        {project.startupName}
                      </h4>
                      {project.location && (
                        <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground mt-1">
                          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="line-clamp-1">
                            {project.location}
                          </span>
                        </div>
                      )}
                    </div>

                    <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              {/* PARTICIPANTS SECTION */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  <Users className="w-4 h-4" />
                  <span>Participants</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      label: "Founder",
                      data: founder,
                      type: "FOUNDER" as const,
                      color: "primary",
                    },
                    {
                      label: "Investor",
                      data: investor,
                      type: "INVESTOR" as const,
                      color: "blue",
                    },
                  ].map(({ label, data, type, color }) => (
                    <div
                      key={label}
                      className="group relative overflow-hidden rounded-xl border-2 bg-card hover:border-primary/30 hover:shadow-lg transition-all duration-300 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(getProfileRoute(data.id, type));
                        onClose();
                      }}
                    >
                      <div
                        className={`absolute inset-0 bg-gradient-to-r ${
                          color === "primary"
                            ? "from-primary/0 via-primary/5 to-primary/0"
                            : "from-blue-500/0 via-blue-500/5 to-blue-500/0"
                        } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                      />

                      <div className="relative flex items-center gap-3 p-4">
                        <Avatar className="h-12 w-12 sm:h-14 sm:w-14 ring-2 ring-background shadow-md flex-shrink-0">
                          <AvatarImage src={data.profileImg} alt={data.name} />
                          <AvatarFallback
                            className={`bg-gradient-to-br font-semibold text-base sm:text-lg ${
                              color === "primary"
                                ? "from-primary to-primary/80 text-primary-foreground"
                                : "from-blue-500 to-blue-600 text-white"
                            }`}
                          >
                            {data.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm sm:text-base group-hover:text-primary transition-colors line-clamp-1">
                            {data.name}
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {label}
                          </p>
                        </div>

                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex-shrink-0" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Extra padding at bottom for mobile */}
              <div className="h-4 sm:hidden" />
            </div>
          </div>

          {/* FOOTER ACTION - Fixed at bottom */}
          {isScheduled && (
            <div className="border-t p-4 space-y-3">
              <Button className="w-full gap-2">
                <Video className="w-4 h-4" />
                Join Session
              </Button>

              <Button
                variant="destructive"
                onClick={() => setOpenCancelModal(true)}
                className="w-full gap-2"
              >
                <XCircle className="w-4 h-4" />
                Cancel Session
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <RejectReasonModal
        isOpen={openCancelModal}
        onClose={() => setOpenCancelModal(false)}
        onSubmit={handleCancelSubmit}
        title="Cancel Session"
        label="Reason for cancelling this session"
      />
    </>
  );
}

import { Calendar, Clock, Video, Eye, MapPin, Users2, Dot } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import type { PersonDTO, SessionDTO } from "../../types/session";
import { useState } from "react";
import { SessionDetailsModal } from "../modals/SessionDetailsModal";

interface Props {
  session: SessionDTO;
  project: {
    id: string;
    startupName: string;
    logoUrl?: string;
    coverImageUrl?: string;
    location?: string;
  };
  founder: PersonDTO;
  investor: PersonDTO;
  stage: string;
}

export function SessionCard({
  session,
  project,
  investor,
  stage,
  founder,
}: Props) {
  const date = new Date(session.date);
  const [open, setOpen] = useState(false);
  const isScheduled = session.status === "scheduled";
  const isCompleted = session.status === "completed";
  const isCancelled = session.status === "cancelled";

  // Format date elegantly
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Format time
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

  const isUpcoming = session.status === "scheduled";

  return (
    <>
      <Card className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 border-0 ring-1 ring-border hover:ring-2 hover:ring-primary/40 bg-card">
        {/* Clean Top Border */}
        <div
          className={`h-1 ${
            isScheduled
              ? "bg-primary"
              : isCompleted
                ? "bg-green-500"
                : "bg-red-500"
          }`}
        />

        <div className="p-6 space-y-6">
          {/* STATUS & STAGE ROW */}
          <div className="flex items-center justify-between">
            <Badge
              className={`border-0 font-medium ${
                isScheduled
                  ? "bg-primary/10 text-primary"
                  : isCompleted
                    ? "bg-green-500/10 text-green-700"
                    : "bg-red-500/10 text-red-700"
              }`}
            >
              {isScheduled
                ? "Upcoming"
                : isCompleted
                  ? "Completed"
                  : "Cancelled"}
            </Badge>
            <span className="text-xs font-medium text-muted-foreground px-2.5 py-1 bg-muted/50 rounded-full">
              {stage}
            </span>
          </div>

          {/* SESSION TITLE */}
          <div className="space-y-1">
            <h3 className="font-bold text-xl leading-tight group-hover:text-primary transition-colors line-clamp-2">
              {session.sessionName}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {project.startupName}
              {project.location && (
                <>
                  <Dot className="inline w-4 h-4" />
                  {project.location}
                </>
              )}
            </p>
          </div>

          {/* DATE & TIME GRID */}
          <div className="space-y-3 py-4 border-y">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="font-semibold text-sm">{formattedDate}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/10">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Time</p>
                <p className="font-semibold text-sm">
                  {formattedTime} • {session.duration} mins
                </p>
              </div>
            </div>
          </div>

          {/* PARTICIPANTS */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Users2 className="w-4 h-4" />
              <span>Session Participants</span>
            </div>

            <div className="flex items-center -space-x-2">
              <Avatar className="h-10 w-10 ring-4 ring-background shadow-md hover:z-10 hover:scale-110 transition-transform cursor-pointer">
                <AvatarImage src={founder.profileImg} alt={founder.name} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-semibold text-sm">
                  {founder.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Avatar className="h-10 w-10 ring-4 ring-background shadow-md hover:z-10 hover:scale-110 transition-transform cursor-pointer">
                <AvatarImage src={investor.profileImg} alt={investor.name} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold text-sm">
                  {investor.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="pl-4 flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {founder.name} & {investor.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  Founder • Investor
                </p>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="space-y-2.5">
            {isScheduled && (
              <Button className="w-full h-11 gap-2 shadow-md hover:shadow-lg transition-all font-semibold">
                <Video className="w-4 h-4" />
                Join Session
              </Button>
            )}

            <Button
              variant="outline"
              className="w-full h-10 gap-2 font-medium hover:bg-accent transition-all"
              onClick={() => setOpen(true)}
            >
              <Eye className="w-4 h-4" />
              View Details
            </Button>
          </div>
        </div>

        {/* Subtle Hover Effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </Card>

      <SessionDetailsModal
        open={open}
        onClose={() => setOpen(false)}
        session={session}
        stage={stage}
        project={project}
        founder={founder}
        investor={investor}
      />
    </>
  );
}

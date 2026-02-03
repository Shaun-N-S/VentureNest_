import { Calendar, Clock, Video } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import type { PersonDTO, SessionDTO } from "../../types/session";

interface Props {
  session: SessionDTO;
  projectName: string;
  founder: PersonDTO;
}

export function SessionCard({ session, projectName, founder }: Props) {
  const date = new Date(session.date);

  // Format date
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Format time - handle both startTime string and extract time from date if needed
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
    <Card className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50">
      {/* Status Indicator */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 ${
          isUpcoming
            ? "bg-gradient-to-r from-primary via-primary/80 to-primary"
            : "bg-gradient-to-r from-green-500 via-green-600 to-green-500"
        }`}
      />

      <div className="p-5 space-y-4">
        {/* HEADER */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base truncate group-hover:text-primary transition-colors">
              {session.sessionName}
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5 truncate">
              {projectName}
            </p>
          </div>

          <div className="flex-shrink-0">
            <Avatar className="h-10 w-10 ring-2 ring-background shadow-md">
              <AvatarImage src={founder.profileImg} alt={founder.name} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-semibold">
                {founder.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* FOUNDER NAME */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">with</span>
          <span className="font-medium text-foreground">{founder.name}</span>
        </div>

        {/* DIVIDER */}
        <div className="border-t" />

        {/* META INFORMATION */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
              <Calendar className="w-4 h-4 text-primary" />
            </div>
            <span className="text-foreground font-medium">{formattedDate}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10">
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-foreground">
              {formattedTime} • {session.duration} mins
            </span>
          </div>
        </div>

        {/* STATUS BADGE */}
        <div className="flex items-center justify-between pt-2">
          <span
            className={`
              inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
              ${
                isUpcoming
                  ? "bg-primary/10 text-primary"
                  : "bg-green-500/10 text-green-700"
              }
            `}
          >
            {isUpcoming ? "Scheduled" : "Completed"}
          </span>
        </div>

        {/* ACTION BUTTON */}
        {isUpcoming && (
          <Button
            size="sm"
            className="w-full gap-2 shadow-md hover:shadow-lg transition-all"
          >
            <Video className="w-4 h-4" />
            Start Session
          </Button>
        )}
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </Card>
  );
}

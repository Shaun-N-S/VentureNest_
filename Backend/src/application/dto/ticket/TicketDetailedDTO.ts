import { SessionStatus } from "@domain/enum/sessionStatus";
import { TicketStage } from "@domain/enum/ticketStage";
import { TicketStatus } from "@domain/enum/ticketStatus";

export interface TicketDetailedDTO {
  ticketId: string;
  ticketNumber: string;

  currentStage: TicketStage;
  overallStatus: TicketStatus;

  createdAt: Date;

  project: {
    id: string;
    startupName: string;
    coverImageUrl?: string;
    logoUrl?: string;
    location?: string;
  };

  founder: {
    id: string;
    name: string;
    profileImg?: string;
  };

  investor: {
    id: string;
    name: string;
    profileImg?: string;
  };

  sessions: {
    id: string;
    sessionName: string;
    date: Date;
    startTime?: Date;
    duration: number;
    status: SessionStatus;
    stage: TicketStage;
    decision?: TicketStatus;
    cancelReason?: string;
  }[];
}

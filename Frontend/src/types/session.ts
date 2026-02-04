import type { TicketStage } from "./ticket";

export const SessionStatus = {
  SCHEDULED: "scheduled",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export type SessionStatus = (typeof SessionStatus)[keyof typeof SessionStatus];

export interface SessionDTO {
  id: string;
  sessionName: string;
  date: string; // ISO
  startTime?: string; // ISO
  duration: number;
  status: SessionStatus;
  stage: TicketStage;
  cancelReason?: string;
}

export interface PersonDTO {
  id: string;
  name: string;
  profileImg?: string;
}

export interface ProjectDTO {
  id: string;
  startupName: string;
}

export interface InvestorTicketDTO {
  ticketId: string;
  ticketNumber: string;
  stage: string;
  status: string;
  createdAt: string;

  project: {
    id: string;
    startupName: string;
    coverImageUrl?: string;
    logoUrl?: string;
    location?: string;
  };

  founder: PersonDTO;
  investor: PersonDTO;

  sessions: SessionDTO[];
}

export type CancelledBy = "INVESTOR" | "USER";

export interface CancelSessionDTO {
  sessionId: string;
  cancelledBy: CancelledBy;
  reason: string;
  userId: string;
}

export interface CancelledSessionResponseDTO {
  sessionId: string;
  status: string;
  cancelledBy: CancelledBy;
  cancelReason: string;
  updatedAt: string;
}

export interface AddSessionFeedbackDTO {
  sessionId: string;
  feedback: string;
  decision: string; // TicketStatus
}

export interface SessionFeedbackResponseDTO {
  sessionId: string;
  status: "completed";
  feedback: string;
  decision: string;
  updatedAt: string;
}

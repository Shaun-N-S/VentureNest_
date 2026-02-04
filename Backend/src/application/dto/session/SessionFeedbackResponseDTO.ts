import { SessionStatus } from "@domain/enum/sessionStatus";
import { TicketStatus } from "@domain/enum/ticketStatus";

export interface SessionFeedbackResponseDTO {
  sessionId: string;
  status: SessionStatus;
  feedback: string;
  decision: TicketStatus;
  updatedAt: Date;
}

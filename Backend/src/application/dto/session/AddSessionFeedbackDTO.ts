import { TicketStatus } from "@domain/enum/ticketStatus";

export interface AddSessionFeedbackDTO {
  sessionId: string;
  investorId: string;
  feedback: string;
  decision: TicketStatus;
}

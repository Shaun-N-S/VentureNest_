import { TicketStage } from "@domain/enum/ticketStage";

export interface CreateTicketWithSessionDTO {
  projectId: string;
  discussionLevel: TicketStage;
  sessionName: string;
  date: Date;
  startTime?: string | undefined;
  duration: number;
  description?: string | undefined;
  investorId: string;
}

import { TicketStage } from "@domain/enum/ticketStage";

export interface CreateTicketWithSessionDTO {
  projectId: string;
  initialStage: TicketStage;
  sessionName: string;
  date: Date;
  startTime?: string;
  duration: number;
  investorId: string;
}

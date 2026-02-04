import { TicketStage } from "@domain/enum/ticketStage";
import { TicketStatus } from "@domain/enum/ticketStatus";

export interface TicketEntity {
  _id?: string;
  ticketNumber: string;

  investorId: string;
  founderId: string;
  projectId: string;

  companyName?: string;

  currentStage: TicketStage;
  overallStatus: TicketStatus;

  createdAt?: Date;
  updatedAt?: Date;
}

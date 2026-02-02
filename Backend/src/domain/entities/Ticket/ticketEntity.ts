import { TicketStage } from "@domain/enum/ticketStage";
import { TicketStatus } from "@domain/enum/ticketStatus";

export interface TicketEntity {
  _id?: string;
  ticketNumber: string;

  investorId: string;
  founderId: string;
  projectId: string;

  companyName?: string | undefined;

  stage: TicketStage;
  status: TicketStatus;

  createdAt?: Date;
  updatedAt?: Date;
}

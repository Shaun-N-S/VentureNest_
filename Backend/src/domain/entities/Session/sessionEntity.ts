import { TicketStage } from "@domain/enum/ticketStage";
import { TicketStatus } from "@domain/enum/ticketStatus";
import { SessionCancelledBy } from "@domain/enum/sessionCancelledBy";
import { SessionStatus } from "@domain/enum/sessionStatus";

export interface SessionEntity {
  _id?: string;

  ticketId: string;
  investorId: string;
  founderId: string;
  projectId: string;

  sessionName: string;
  date: Date;
  startTime?: Date;
  duration: number;

  status: SessionStatus;

  stage: TicketStage;
  decision?: TicketStatus;

  feedback?: string;

  cancelledBy?: SessionCancelledBy;
  cancelReason?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

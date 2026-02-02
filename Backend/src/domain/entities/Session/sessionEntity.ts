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

  cancelledBy?: SessionCancelledBy;
  cancelReason?: string | undefined;

  feedback?: string | undefined;

  createdAt?: Date;
  updatedAt?: Date;
}

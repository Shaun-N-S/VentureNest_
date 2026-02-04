import { SessionEntity } from "@domain/entities/Session/sessionEntity";
import { IBaseRepository } from "./IBaseRepository";
import { SessionCancelledBy } from "@domain/enum/sessionCancelledBy";
import { TicketStatus } from "@domain/enum/ticketStatus";

export interface ISessionRepository extends IBaseRepository<SessionEntity> {
  findByTicket(ticketId: string): Promise<SessionEntity[]>;

  cancelSession(
    sessionId: string,
    cancelledBy: SessionCancelledBy,
    reason: string
  ): Promise<SessionEntity | null>;

  addFeedback(
    sessionId: string,
    feedback: string,
    decision: TicketStatus
  ): Promise<SessionEntity | null>;
}

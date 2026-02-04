import { SessionEntity } from "@domain/entities/Session/sessionEntity";
import { IBaseRepository } from "./IBaseRepository";
import { SessionCancelledBy } from "@domain/enum/sessionCancelledBy";

export interface ISessionRepository extends IBaseRepository<SessionEntity> {
  findByTicket(ticketId: string): Promise<SessionEntity[]>;

  cancelSession(
    sessionId: string,
    cancelledBy: SessionCancelledBy,
    reason: string
  ): Promise<SessionEntity | null>;
}

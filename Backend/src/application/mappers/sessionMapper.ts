import { SessionEntity } from "@domain/entities/Session/sessionEntity";
import { SessionCancelledBy } from "@domain/enum/sessionCancelledBy";
import { SessionStatus } from "@domain/enum/sessionStatus";
import { ISessionModel } from "@infrastructure/db/models/sessionModel";

export class SessionMapper {
  static toEntity(doc: ISessionModel): SessionEntity {
    return {
      _id: doc._id.toString(),
      ticketId: doc.ticketId.toString(),
      investorId: doc.investorId.toString(),
      founderId: doc.founderId.toString(),
      projectId: doc.projectId.toString(),
      sessionName: doc.sessionName,
      date: doc.date,
      duration: doc.duration,
      status: doc.status as SessionStatus,
      cancelledBy: doc.cancelledBy as SessionCancelledBy,
      cancelReason: doc.cancelReason,
      feedback: doc.feedback,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}

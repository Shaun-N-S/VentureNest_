import { ISessionRepository } from "@domain/interfaces/repositories/ISessionRepository";
import { ISessionModel } from "@infrastructure/db/models/sessionModel";
import { SessionStatus } from "@domain/enum/sessionStatus";
import { SessionEntity } from "@domain/entities/Session/sessionEntity";
import { SessionMapper } from "application/mappers/sessionMapper";
import { SessionCancelledBy } from "@domain/enum/sessionCancelledBy";
import { BaseRepository } from "./baseRepository";
import { Model } from "mongoose";
import { TicketStatus } from "@domain/enum/ticketStatus";

export class SessionRepository
  extends BaseRepository<SessionEntity, ISessionModel>
  implements ISessionRepository
{
  constructor(protected _model: Model<ISessionModel>) {
    super(_model, SessionMapper);
  }

  async findByTicket(ticketId: string): Promise<SessionEntity[]> {
    const docs = await this._model.find({ ticketId }).sort({ date: 1 });
    return docs.map(SessionMapper.toEntity);
  }

  async cancelSession(
    sessionId: string,
    cancelledBy: SessionCancelledBy,
    reason: string
  ): Promise<SessionEntity | null> {
    const doc = await this._model.findByIdAndUpdate(
      sessionId,
      {
        status: SessionStatus.CANCELLED,
        cancelledBy,
        cancelReason: reason,
      },
      { new: true }
    );

    return doc ? SessionMapper.toEntity(doc) : null;
  }

  async addFeedback(
    sessionId: string,
    feedback: string,
    decision: TicketStatus
  ): Promise<SessionEntity | null> {
    const doc = await this._model.findByIdAndUpdate(
      sessionId,
      {
        feedback,
        decision,
        status: SessionStatus.COMPLETED,
      },
      { new: true }
    );

    return doc ? SessionMapper.toEntity(doc) : null;
  }

  async joinSession(sessionId: string, userId: string): Promise<SessionEntity | null> {
    const session = await this._model.findById(sessionId);

    if (!session) return null;

    if (!session.waitingUsers) {
      session.waitingUsers = [];
    }

    if (!session.allowedUsers) {
      session.allowedUsers = [];
    }

    if (session.investorId.toString() === userId) {
      session.hostJoined = true;
    } else {
      const alreadyWaiting = session.waitingUsers.some((id) => id.toString() === userId);

      if (!alreadyWaiting) {
        session.waitingUsers.push(userId as any);
      }
    }

    await session.save();

    return SessionMapper.toEntity(session);
  }
}

import { ISessionRepository } from "@domain/interfaces/repositories/ISessionRepository";
import { ISessionModel } from "@infrastructure/db/models/sessionModel";
import { SessionStatus } from "@domain/enum/sessionStatus";
import { SessionEntity } from "@domain/entities/Session/sessionEntity";
import { SessionMapper } from "application/mappers/sessionMapper";
import { SessionCancelledBy } from "@domain/enum/sessionCancelledBy";
import { BaseRepository } from "./baseRepository";
import { Model } from "mongoose";

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
}

import { ISessionRepository } from "@domain/interfaces/repositories/ISessionRepository";
import { sessionModel } from "@infrastructure/db/models/sessionModel";
import { SessionStatus } from "@domain/enum/sessionStatus";
import { SessionEntity } from "@domain/entities/Session/sessionEntity";
import { SessionMapper } from "application/mappers/sessionMapper";
import { SessionCancelledBy } from "@domain/enum/sessionCancelledBy";

export class SessionRepository implements ISessionRepository {
  async save(data: SessionEntity): Promise<SessionEntity> {
    const doc = await sessionModel.create(data);
    return SessionMapper.toEntity(doc);
  }

  async findById(id: string): Promise<SessionEntity | null> {
    const doc = await sessionModel.findById(id);
    return doc ? SessionMapper.toEntity(doc) : null;
  }

  async findAll(
    skip = 0,
    limit = 10,
    status?: string,
    search?: string,
    extraQuery: any = {}
  ): Promise<SessionEntity[]> {
    const query: any = { ...extraQuery };

    if (status) query.status = status;
    if (search) query.sessionName = { $regex: search, $options: "i" };

    const docs = await sessionModel.find(query).skip(skip).limit(limit).sort({ date: 1 });

    return docs.map(SessionMapper.toEntity);
  }

  async findByIds(ids: string[]): Promise<SessionEntity[]> {
    const docs = await sessionModel.find({ _id: { $in: ids } });
    return docs.map(SessionMapper.toEntity);
  }

  async count(status?: string, search?: string, extraQuery: any = {}): Promise<number> {
    const query: any = { ...extraQuery };

    if (status) query.status = status;
    if (search) query.sessionName = { $regex: search, $options: "i" };

    return sessionModel.countDocuments(query);
  }

  async update(id: string, data: Partial<SessionEntity>): Promise<SessionEntity | null> {
    const doc = await sessionModel.findByIdAndUpdate(id, data, { new: true });
    return doc ? SessionMapper.toEntity(doc) : null;
  }

  async findByTicket(ticketId: string): Promise<SessionEntity[]> {
    const docs = await sessionModel.find({ ticketId }).sort({ date: 1 });

    return docs.map(SessionMapper.toEntity);
  }

  async cancelSession(
    sessionId: string,
    cancelledBy: SessionCancelledBy,
    reason: string
  ): Promise<SessionEntity | null> {
    const doc = await sessionModel.findByIdAndUpdate(
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

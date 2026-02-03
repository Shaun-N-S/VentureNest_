import { SessionEntity } from "@domain/entities/Session/sessionEntity";
import { SessionStatus } from "@domain/enum/sessionStatus";
import { ISessionModel } from "@infrastructure/db/models/sessionModel";
import mongoose from "mongoose";

export class SessionMapper {
  static createFromTicket(params: {
    ticketId: string;
    project: { _id: string; userId: string };
    investorId: string;
    sessionName: string;
    date: Date;
    startTime?: Date | undefined;
    duration: number;
    description?: string | undefined;
  }): SessionEntity {
    const { ticketId, project, investorId, sessionName, date, startTime, duration, description } =
      params;

    return {
      ticketId,
      investorId,
      founderId: project.userId,
      projectId: project._id,
      sessionName,
      date,
      duration,
      status: SessionStatus.SCHEDULED,
      ...(startTime && { startTime: new Date(startTime) }),
      ...(description && { feedback: description }),
    };
  }

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
      ...(doc.cancelledBy && { cancelledBy: doc.cancelledBy }),
      ...(doc.cancelReason && { cancelReason: doc.cancelReason }),
      ...(doc.feedback && { feedback: doc.feedback }),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  static toMongooseDocument(entity: SessionEntity) {
    return {
      ticketId: new mongoose.Types.ObjectId(entity.ticketId),
      investorId: new mongoose.Types.ObjectId(entity.investorId),
      founderId: new mongoose.Types.ObjectId(entity.founderId),
      projectId: new mongoose.Types.ObjectId(entity.projectId),
      sessionName: entity.sessionName,
      date: entity.date,
      startTime: entity.startTime,
      duration: entity.duration,
      status: entity.status,
      cancelledBy: entity.cancelledBy,
      cancelReason: entity.cancelReason,
      feedback: entity.feedback,
    };
  }

  static fromMongooseDocument(doc: ISessionModel): SessionEntity {
    return SessionMapper.toEntity(doc);
  }
}

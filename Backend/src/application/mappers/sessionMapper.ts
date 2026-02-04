import { SessionEntity } from "@domain/entities/Session/sessionEntity";
import { SessionStatus } from "@domain/enum/sessionStatus";
import { TicketStage } from "@domain/enum/ticketStage";
import { TicketStatus } from "@domain/enum/ticketStatus";
import { ISessionModel } from "@infrastructure/db/models/sessionModel";
import mongoose from "mongoose";

export class SessionMapper {
  static createFromTicket(params: {
    ticketId: string;
    project: { _id: string; userId: string };
    investorId: string;
    sessionName: string;
    date: Date;
    startTime?: Date;
    duration: number;
    stage: TicketStage;
  }): SessionEntity {
    const { ticketId, project, investorId, sessionName, date, startTime, duration, stage } = params;

    return {
      ticketId,
      investorId,
      founderId: project.userId,
      projectId: project._id,

      sessionName,
      date,
      duration,

      status: SessionStatus.SCHEDULED,
      stage,

      ...(startTime && { startTime }), // ✅ FIX
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
      stage: doc.stage as TicketStage,
      decision: doc.decision as TicketStatus,

      ...(doc.startTime && { startTime: doc.startTime }), // ✅ FIX
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
      duration: entity.duration,

      status: entity.status,
      stage: entity.stage,
      decision: entity.decision,

      ...(entity.startTime && { startTime: entity.startTime }), // ✅ FIX
      ...(entity.cancelledBy && { cancelledBy: entity.cancelledBy }),
      ...(entity.cancelReason && { cancelReason: entity.cancelReason }),
      ...(entity.feedback && { feedback: entity.feedback }),
    };
  }

  static fromMongooseDocument(doc: ISessionModel): SessionEntity {
    return SessionMapper.toEntity(doc);
  }
}

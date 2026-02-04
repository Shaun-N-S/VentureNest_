import { TicketEntity } from "@domain/entities/Ticket/ticketEntity";
import { TicketStage } from "@domain/enum/ticketStage";
import { TicketStatus } from "@domain/enum/ticketStatus";
import { ITicketModel } from "@infrastructure/db/models/ticketModel";
import mongoose from "mongoose";

export class TicketMapper {
  static createFromProject(params: {
    project: {
      _id: string;
      userId: string;
      startupName: string;
    };
    investorId: string;
    initialStage: TicketStage;
  }): TicketEntity {
    const { project, investorId, initialStage } = params;

    return {
      ticketNumber: `TKT-${Date.now()}`,
      investorId,
      founderId: project.userId,
      projectId: project._id,
      companyName: project.startupName,

      // ✅ NEW FIELDS
      currentStage: initialStage,
      overallStatus: TicketStatus.PROCEED,
    };
  }

  static toMongoose(entity: TicketEntity) {
    return {
      _id: entity._id ? new mongoose.Types.ObjectId(entity._id) : undefined,
      ticketNumber: entity.ticketNumber,
      investorId: new mongoose.Types.ObjectId(entity.investorId),
      founderId: new mongoose.Types.ObjectId(entity.founderId),
      projectId: new mongoose.Types.ObjectId(entity.projectId),
      companyName: entity.companyName,

      // ✅ NEW FIELDS
      currentStage: entity.currentStage,
      overallStatus: entity.overallStatus,
    };
  }

  static toEntity(doc: ITicketModel): TicketEntity {
    return {
      _id: doc._id.toString(),
      ticketNumber: doc.ticketNumber,
      investorId: doc.investorId.toString(),
      founderId: doc.founderId.toString(),
      projectId: doc.projectId.toString(),
      companyName: doc.companyName || "",

      currentStage: doc.currentStage as TicketStage,
      overallStatus: doc.overallStatus as TicketStatus,

      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  static toMongooseDocument(entity: TicketEntity) {
    return TicketMapper.toMongoose(entity);
  }

  static fromMongooseDocument(doc: ITicketModel): TicketEntity {
    return TicketMapper.toEntity(doc);
  }
}

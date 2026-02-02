import { TicketEntity } from "@domain/entities/Ticket/ticketEntity";
import { ITicketModel } from "@infrastructure/db/models/ticketModel";
import mongoose from "mongoose";

export class TicketMapper {
  static toMongoose(entity: TicketEntity) {
    return {
      _id: entity._id ? new mongoose.Types.ObjectId(entity._id) : undefined,
      ticketNumber: entity.ticketNumber,
      investorId: entity.investorId,
      founderId: entity.founderId,
      projectId: entity.projectId,
      companyName: entity.companyName,
      stage: entity.stage,
      status: entity.status,
    };
  }

  static toEntity(doc: ITicketModel): TicketEntity {
    return {
      _id: doc._id.toString(),
      ticketNumber: doc.ticketNumber,
      investorId: doc.investorId.toString(),
      founderId: doc.founderId.toString(),
      projectId: doc.projectId.toString(),
      companyName: doc.companyName,
      stage: doc.stage as any,
      status: doc.status as any,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}

import { ProjectMonthlyReportEntity } from "@domain/entities/project/projectMonthlyReportEntity";
import { IProjectMonthlyReportModel } from "@infrastructure/db/models/projectMonthlyReportModel";
import {
  ProjectMonthlyReportResDTO,
  CreateProjectMonthlyReportEntityDTO,
} from "application/dto/project/projectMonthlyReportDTO";
import mongoose from "mongoose";
import { ProjectReportMonth } from "@domain/enum/reportMonth";
import { NetProfitLossType } from "@domain/enum/NetProfitLossType";

export class ProjectMonthlyReportMapper {
  // ------------------ 1. Entity → DTO ------------------
  static toDTO(entity: ProjectMonthlyReportEntity): ProjectMonthlyReportResDTO {
    return {
      _id: entity._id!,
      projectId: entity.projectId,

      month: entity.month,
      year: entity.year,

      revenue: entity.revenue,
      expenditure: entity.expenditure,

      netProfitLossType: entity.netProfitLossType,
      netProfitLossAmount: entity.netProfitLossAmount,

      keyAchievement: entity.keyAchievement,
      challenges: entity.challenges,

      isConfirmed: entity.isConfirmed,

      createdAt: entity.createdAt!,
      updatedAt: entity.updatedAt!,
    };
  }

  // ------------------ 2. Create DTO → Entity ------------------
  static createToEntity(dto: CreateProjectMonthlyReportEntityDTO): ProjectMonthlyReportEntity {
    const now = new Date();

    return {
      _id: new mongoose.Types.ObjectId().toString(),

      projectId: dto.projectId,

      month: dto.month as ProjectReportMonth,
      year: dto.year,

      revenue: dto.revenue,
      expenditure: dto.expenditure,

      netProfitLossType: dto.netProfitLossType as NetProfitLossType,
      netProfitLossAmount: dto.netProfitLossAmount,

      keyAchievement: dto.keyAchievement,
      challenges: dto.challenges,

      isConfirmed: dto.isConfirmed ?? false,
      createdAt: now,
      updatedAt: now,
    };
  }

  // ------------------ 3. Mongoose Document → Entity ------------------
  static fromMongooseDocument(doc: IProjectMonthlyReportModel): ProjectMonthlyReportEntity {
    return {
      _id: doc._id?.toString()!,
      projectId: doc.projectId?.toString(),

      month: doc.month as ProjectReportMonth,
      year: doc.year,

      revenue: doc.revenue,
      expenditure: doc.expenditure,

      netProfitLossType: doc.netProfitLossType as NetProfitLossType,
      netProfitLossAmount: doc.netProfitLossAmount,

      keyAchievement: doc.keyAchievement,
      challenges: doc.challenges,

      isConfirmed: doc.isConfirmed,

      createdAt: doc.createdAt || new Date(),
      updatedAt: doc.updatedAt || new Date(),
    };
  }

  // ------------------ 4. Entity → Mongoose Document ------------------
  static toMongooseDocument(entity: ProjectMonthlyReportEntity) {
    return {
      _id: entity._id ? new mongoose.Types.ObjectId(entity._id) : undefined,

      projectId: new mongoose.Types.ObjectId(entity.projectId),

      month: entity.month,
      year: entity.year,

      revenue: entity.revenue,
      expenditure: entity.expenditure,

      netProfitLossType: entity.netProfitLossType,
      netProfitLossAmount: entity.netProfitLossAmount,

      keyAchievement: entity.keyAchievement,
      challenges: entity.challenges,

      isConfirmed: entity.isConfirmed ?? false,

      createdAt: entity.createdAt ?? new Date(),
      updatedAt: new Date(),
    };
  }
}

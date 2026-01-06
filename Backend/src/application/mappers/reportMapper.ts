import mongoose from "mongoose";
import { ReportEntity } from "@domain/entities/report/reportEntity";
import { CreateReportDTO } from "application/dto/report/createReportDTO";
import { ReportDTO } from "application/dto/report/reportDTO";
import { AdminReportDTO } from "application/dto/report/adminReportDTO";
import { IReportModel } from "@infrastructure/db/models/reportModel";
import { ReportStatus } from "@domain/enum/reportStatus";

export class ReportMapper {
  static toEntity(dto: CreateReportDTO): ReportEntity {
    return {
      _id: new mongoose.Types.ObjectId().toString(),

      reportedById: dto.reportedById,
      reportedByType: dto.reportedByType,

      targetType: dto.targetType,
      targetId: dto.targetId,

      reasonCode: dto.reasonCode,
      ...(dto.reasonText && { reasonText: dto.reasonText }),

      status: ReportStatus.PENDING,

      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  static toDTO(entity: ReportEntity): ReportDTO {
    return {
      _id: entity._id!,
      reportedById: entity.reportedById,
      reportedByType: entity.reportedByType,
      targetType: entity.targetType,
      targetId: entity.targetId,
      reasonCode: entity.reasonCode,
      ...(entity.reasonText && { reasonText: entity.reasonText }),
      status: entity.status,
      ...(entity.createdAt && { createdAt: entity.createdAt }),
    };
  }

  static toAdminDTO(entity: ReportEntity): AdminReportDTO {
    return {
      _id: entity._id!,
      reportedById: entity.reportedById,
      reportedByType: entity.reportedByType,
      targetType: entity.targetType,
      targetId: entity.targetId,
      reasonCode: entity.reasonCode,
      ...(entity.reasonText && { reasonText: entity.reasonText }),
      status: entity.status,
      ...(entity.reviewedAt && { reviewedAt: entity.reviewedAt }),
      ...(entity.createdAt && { createdAt: entity.createdAt }),
    };
  }

  static toMongooseDocument(entity: ReportEntity) {
    return {
      _id: new mongoose.Types.ObjectId(entity._id),
      reportedById: new mongoose.Types.ObjectId(entity.reportedById),
      reportedByType: entity.reportedByType,
      targetType: entity.targetType,
      targetId: new mongoose.Types.ObjectId(entity.targetId),
      reasonCode: entity.reasonCode,
      ...(entity.reasonText && { reasonText: entity.reasonText }),
      status: entity.status,
      ...(entity.reviewedAt && { reviewedAt: entity.reviewedAt }),
      ...(entity.createdAt && { createdAt: entity.createdAt }),
      ...(entity.updatedAt && { updatedAt: entity.updatedAt }),
    };
  }

  static fromMongooseDocument(doc: IReportModel): ReportEntity {
    return {
      _id: doc._id.toString(),
      reportedById: doc.reportedById.toString(),
      reportedByType: doc.reportedByType,
      targetType: doc.targetType,
      targetId: doc.targetId.toString(),
      reasonCode: doc.reasonCode,
      ...(doc.reasonText && { reasonText: doc.reasonText }),
      status: doc.status,
      ...(doc.reviewedAt && { reviewedAt: doc.reviewedAt }),
      ...(doc.createdAt && { createdAt: doc.createdAt }),
      ...(doc.updatedAt && { updatedAt: doc.updatedAt }),
    };
  }
}

import mongoose from "mongoose";
import { PlanEntity } from "@domain/entities/plan/planEntity";
import { IPlanModel } from "@infrastructure/db/models/planModel";
import { CreatePlanDTO } from "application/dto/plan/createPlanDTO";
import { PlanDTO } from "application/dto/plan/planDTO";
import { PlanStatus } from "@domain/enum/planStatus";
import { UpdatePlanDTO } from "application/dto/plan/updatePlanDTO";

export class PlanMapper {
  static toEntity(dto: CreatePlanDTO): PlanEntity {
    return {
      _id: new mongoose.Types.ObjectId().toString(),
      name: dto.name,
      role: dto.role,
      description: dto.description,
      limits: dto.limits,
      billing: dto.billing,
      status: PlanStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  static toDTO(entity: PlanEntity): PlanDTO {
    return {
      _id: entity._id!,
      name: entity.name,
      role: entity.role,
      description: entity.description,
      limits: entity.limits,
      billing: entity.billing,
      status: entity.status,
      createdAt: entity.createdAt ?? new Date(),
      updatedAt: entity.updatedAt ?? new Date(),
    };
  }

  static toMongooseDocument(entity: PlanEntity) {
    return {
      _id: new mongoose.Types.ObjectId(entity._id),
      name: entity.name,
      role: entity.role,
      description: entity.description,
      limits: entity.limits,
      billing: entity.billing,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static fromMongooseDocument(doc: IPlanModel): PlanEntity {
    return {
      _id: doc._id.toString(),
      name: doc.name,
      role: doc.role,
      description: doc.description,
      limits: doc.limits,
      billing: doc.billing,
      status: doc.status,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  static mergeForUpdate(existing: PlanEntity, update: UpdatePlanDTO): PlanEntity {
    return {
      ...existing,

      name: update.name ?? existing.name,
      description: update.description ?? existing.description,

      limits: {
        messages: update.limits?.messages ?? existing.limits.messages,
        consentLetters: update.limits?.consentLetters ?? existing.limits.consentLetters,
        profileBoost: update.limits?.profileBoost ?? existing.limits.profileBoost,
      },

      billing: {
        durationDays: update.billing?.durationDays ?? existing.billing.durationDays,
        price: update.billing?.price ?? existing.billing.price,
      },

      updatedAt: new Date(),
    };
  }
}

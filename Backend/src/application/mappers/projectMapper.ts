import { ProjectEntity } from "@domain/entities/project/projectEntity";
import {
  ProjectResDTO,
  CreateProjectEntityDTO,
  UpdateProjectEntityDTO,
} from "application/dto/project/projectDTO";
import mongoose from "mongoose";

export class ProjectMapper {
  static toDTO(entity: ProjectEntity): ProjectResDTO {
    return {
      _id: entity._id!,
      userId: entity.userId,
      startupName: entity.startupName,
      shortDescription: entity.shortDescription,
      pitchDeckUrl: entity.pitchDeckUrl,
      projectWebsite: entity.projectWebsite,
      userRole: entity.userRole,
      teamSize: entity.teamSize,
      category: entity.category,
      stage: entity.stage,
      logoUrl: entity.logoUrl,
      coverImageUrl: entity.coverImageUrl,
      location: entity.location,
      likes: entity.likes,
      likeCount: entity.likeCount,
      isActive: entity.isActive,
      donationEnabled: entity.donationEnabled,
      donationTarget: entity.donationTarget,
      donationReceived: entity.donationReceived,
      projectRegister: entity.projectRegister,
      createdAt: entity.createdAt!,
      updatedAt: entity.updatedAt!,
      ...(entity.walletId && { walletId: entity.walletId }),
    };
  }

  static toEntity(dto: ProjectResDTO): ProjectEntity {
    return {
      _id: dto._id,
      userId: dto.userId,
      startupName: dto.startupName,
      shortDescription: dto.shortDescription,
      pitchDeckUrl: dto.pitchDeckUrl || "",
      projectWebsite: dto.projectWebsite || "",
      userRole: dto.userRole,
      teamSize: dto.teamSize,
      category: dto.category,
      stage: dto.stage,
      logoUrl: dto.logoUrl || "",
      coverImageUrl: dto.coverImageUrl || "",
      location: dto.location || "",
      likes: dto.likes,
      likeCount: dto.likeCount,
      isActive: dto.isActive,
      donationEnabled: dto.donationEnabled,
      donationTarget: dto.donationTarget,
      donationReceived: dto.donationReceived,
      projectRegister: dto.projectRegister,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
      ...(dto.walletId && { walletId: dto.walletId }),
    };
  }

  static createToEntity(dto: CreateProjectEntityDTO): ProjectEntity {
    const now = new Date();

    return {
      userId: dto.userId,
      startupName: dto.startupName,
      shortDescription: dto.shortDescription,
      pitchDeckUrl: dto.pitchDeckUrl || "",
      projectWebsite: dto.projectWebsite || "",
      userRole: dto.userRole,
      teamSize: dto.teamSize,
      category: dto.category,
      stage: dto.stage,
      logoUrl: dto.logoUrl || "",
      coverImageUrl: dto.coverImageUrl || "",
      location: dto.location || "",
      likes: [],
      likeCount: 0,
      isActive: true,
      donationEnabled: dto.donationEnabled || false,
      donationTarget: dto.donationTarget || 0,
      donationReceived: 0,
      projectRegister: dto.projectRegister || false,
      createdAt: now,
      updatedAt: now,
    };
  }

  static fromMongooseDocument(doc: any): ProjectEntity {
    return {
      _id: doc._id?.toString(),
      userId: doc.userId?.toString(),
      startupName: doc.startupName,
      shortDescription: doc.shortDescription,
      pitchDeckUrl: doc.pitchDeckUrl,
      projectWebsite: doc.projectWebsite,
      userRole: doc.userRole,
      teamSize: doc.teamSize,
      category: doc.category,
      stage: doc.stage,
      logoUrl: doc.logoUrl,
      coverImageUrl: doc.coverImageUrl,
      location: doc.location,
      likes: doc.likes || [],
      likeCount: doc.likeCount || 0,
      isActive: doc.isActive,
      donationEnabled: doc.donationEnabled,
      donationTarget: doc.donationTarget,
      donationReceived: doc.donationReceived,
      projectRegister: doc.projectRegister,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      ...(doc.walletId && { walletId: doc.walletId }),
    };
  }

  static toMongooseDocument(project: ProjectEntity) {
    return {
      _id: project._id ? new mongoose.Types.ObjectId(project._id) : undefined,

      userId: new mongoose.Types.ObjectId(project.userId),

      startupName: project.startupName,
      shortDescription: project.shortDescription,

      pitchDeckUrl: project.pitchDeckUrl ?? "",
      projectWebsite: project.projectWebsite ?? "",

      userRole: project.userRole,
      teamSize: project.teamSize,
      category: project.category,
      stage: project.stage,

      logoUrl: project.logoUrl ?? "",
      coverImageUrl: project.coverImageUrl ?? "",

      location: project.location ?? "",

      likes: project.likes ?? [],
      likeCount: project.likeCount ?? 0,

      isActive: project.isActive ?? true,

      donationEnabled: project.donationEnabled ?? false,
      donationTarget: project.donationTarget ?? 0,
      donationReceived: project.donationReceived ?? 0,

      projectRegister: project.projectRegister ?? false,

      createdAt: project.createdAt ?? new Date(),
      updatedAt: project.updatedAt ?? new Date(),

      ...(project.walletId && { walletId: project.walletId }),
    };
  }

  static updateToEntity(existing: ProjectEntity, dto: UpdateProjectEntityDTO): ProjectEntity {
    const updated: ProjectEntity = {
      _id: existing._id!,
      userId: existing.userId,

      startupName: dto.startupName ?? existing.startupName,
      shortDescription: dto.shortDescription ?? existing.shortDescription,
      projectWebsite: dto.projectWebsite ?? existing.projectWebsite,

      userRole: dto.userRole ?? existing.userRole,
      teamSize: dto.teamSize ?? existing.teamSize,
      category: dto.category ?? existing.category,
      stage: dto.stage ?? existing.stage,

      location: dto.location ?? existing.location,

      pitchDeckUrl: dto.pitchDeckUrl ?? existing.pitchDeckUrl,
      logoUrl: dto.logoUrl ?? existing.logoUrl,
      coverImageUrl: dto.coverImageUrl ?? existing.coverImageUrl,

      donationEnabled: dto.donationEnabled ?? existing.donationEnabled,
      donationTarget: dto.donationTarget ?? existing.donationTarget,
      projectRegister: dto.projectRegister ?? existing.projectRegister,
      donationReceived: existing.donationReceived,

      likes: existing.likes,
      likeCount: existing.likeCount,
      isActive: existing.isActive,

      createdAt: existing.createdAt!,
      updatedAt: new Date(),
    };

    if (existing.walletId) updated.walletId = existing.walletId;

    return updated;
  }
}

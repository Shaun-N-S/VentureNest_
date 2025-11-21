import { ProjectEntity } from "@domain/entities/project/projectEntity";
import {
  ProjectResDTO,
  CreateProjectDTO,
  CreateProjectEntityDTO,
} from "application/dto/project/projectDTO";

export class ProjectMapper {
  // Entity → Response DTO
  static toDTO(entity: ProjectEntity): ProjectResDTO {
    if (!entity._id) throw new Error("Project _id is required");
    if (!entity.createdAt || !entity.updatedAt) {
      throw new Error("Timestamps are required");
    }

    return {
      _id: entity._id,
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
      likes: entity.likes ?? [],
      likeCount: entity.likeCount ?? 0,
      isActive: entity.isActive ?? true,
      donationEnabled: entity.donationEnabled ?? false,
      donationTarget: entity.donationTarget ?? 0,
      donationReceived: entity.donationReceived ?? 0,
      projectRegister: entity.projectRegister ?? false,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      ...(entity.walletId !== undefined && { walletId: entity.walletId }),
    };
  }

  // Response DTO → Entity
  static toEntity(dto: ProjectResDTO): ProjectEntity {
    return {
      _id: dto._id,
      userId: dto.userId,
      startupName: dto.startupName,
      shortDescription: dto.shortDescription,
      pitchDeckUrl: dto.pitchDeckUrl ?? "",
      projectWebsite: dto.projectWebsite ?? "",
      userRole: dto.userRole,
      teamSize: dto.teamSize,
      category: dto.category,
      stage: dto.stage,
      logoUrl: dto.logoUrl ?? "",
      coverImageUrl: dto.coverImageUrl ?? "",
      location: dto.location ?? "",
      likes: dto.likes ?? [],
      likeCount: dto.likeCount ?? 0,
      isActive: dto.isActive ?? true,
      donationEnabled: dto.donationEnabled ?? false,
      donationTarget: dto.donationTarget ?? 0,
      donationReceived: dto.donationReceived ?? 0,
      projectRegister: dto.projectRegister ?? false,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
      ...(dto.walletId !== undefined && { walletId: dto.walletId }),
    };
  }

  // CreateProjectDTO → Entity for Create Use Case
  static createToEntity(dto: CreateProjectEntityDTO): ProjectEntity {
    const now = new Date();

    return {
      userId: dto.userId,
      startupName: dto.startupName,
      shortDescription: dto.shortDescription,
      pitchDeckUrl: dto.pitchDeckUrl ?? "",
      projectWebsite: dto.projectWebsite ?? "",
      userRole: dto.userRole,
      teamSize: dto.teamSize,
      category: dto.category,
      stage: dto.stage,
      logoUrl: dto.logoUrl ?? "",
      coverImageUrl: dto.coverImageUrl ?? "",
      location: dto.location ?? "",
      likes: [],
      likeCount: 0,
      isActive: true,
      donationEnabled: dto.donationEnabled ?? false,
      donationTarget: dto.donationTarget ?? 0,
      donationReceived: 0,
      projectRegister: dto.projectRegister ?? false,
      createdAt: now,
      updatedAt: now,
    };
  }
}

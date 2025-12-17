import { ProjectEntity } from "@domain/entities/project/projectEntity";
import {
  ProjectResDTO,
  CreateProjectEntityDTO,
  UpdateProjectEntityDTO,
  PopulatedProjectRepoDTO,
} from "application/dto/project/projectDTO";
import mongoose from "mongoose";

export class ProjectMapper {
  static toDTO(entity: ProjectEntity): ProjectResDTO {
    return {
      _id: entity._id!,
      userId: entity.userId,
      startupName: entity.startupName,
      shortDescription: entity.shortDescription,

      ...(entity.pitchDeckUrl && { pitchDeckUrl: entity.pitchDeckUrl }),
      ...(entity.projectWebsite && { projectWebsite: entity.projectWebsite }),

      userRole: entity.userRole,
      teamSize: entity.teamSize,
      category: entity.category,
      stage: entity.stage,

      ...(entity.logoUrl && { logoUrl: entity.logoUrl }),
      ...(entity.coverImageUrl && { coverImageUrl: entity.coverImageUrl }),
      ...(entity.location && { location: entity.location }),

      likes: entity.likes,
      liked: false,
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

  static toDTOFromPopulatedRepo(populatedProject: PopulatedProjectRepoDTO): ProjectResDTO {
    const dto: ProjectResDTO = {
      _id: populatedProject._id,
      userId: populatedProject.userId,
      startupName: populatedProject.startupName,
      shortDescription: populatedProject.shortDescription,

      ...(populatedProject.pitchDeckUrl && {
        pitchDeckUrl: populatedProject.pitchDeckUrl,
      }),
      ...(populatedProject.projectWebsite && {
        projectWebsite: populatedProject.projectWebsite,
      }),
      ...(populatedProject.logoUrl && { logoUrl: populatedProject.logoUrl }),
      ...(populatedProject.coverImageUrl && {
        coverImageUrl: populatedProject.coverImageUrl,
      }),
      ...(populatedProject.location && {
        location: populatedProject.location,
      }),
      ...(populatedProject.walletId && {
        walletId: populatedProject.walletId,
      }),

      userRole: populatedProject.userRole,
      teamSize: populatedProject.teamSize,
      category: populatedProject.category,
      stage: populatedProject.stage,

      likes: populatedProject.likes,
      liked: false,
      likeCount: populatedProject.likeCount,
      isActive: populatedProject.isActive,

      donationEnabled: populatedProject.donationEnabled,
      donationTarget: populatedProject.donationTarget,
      donationReceived: populatedProject.donationReceived,

      projectRegister: populatedProject.projectRegister,
      createdAt: populatedProject.createdAt,
      updatedAt: populatedProject.updatedAt,
    };

    if (populatedProject.populatedUser) {
      dto.user = {
        userName: populatedProject.populatedUser.userName,
        profileImg: populatedProject.populatedUser.profileImg,
      };
    }

    return dto;
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

      ...(dto.pitchDeckUrl && { pitchDeckUrl: dto.pitchDeckUrl }),
      ...(dto.projectWebsite && { projectWebsite: dto.projectWebsite }),

      userRole: dto.userRole,
      teamSize: dto.teamSize,
      category: dto.category,
      stage: dto.stage,

      ...(dto.logoUrl && { logoUrl: dto.logoUrl }),
      ...(dto.coverImageUrl && { coverImageUrl: dto.coverImageUrl }),
      ...(dto.location && { location: dto.location }),

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

  static fromMongooseDocument(doc: any): ProjectEntity {
    return {
      _id: doc._id?.toString(),

      // ✔ ALWAYS return userId as string, never object
      userId: doc.userId?._id ? doc.userId._id.toString() : doc.userId?.toString(),

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

      userRole: dto.userRole ?? existing.userRole,
      teamSize: dto.teamSize ?? existing.teamSize,
      category: dto.category ?? existing.category,
      stage: dto.stage ?? existing.stage,

      donationEnabled: dto.donationEnabled ?? existing.donationEnabled,
      donationTarget: dto.donationTarget ?? existing.donationTarget,
      projectRegister: dto.projectRegister ?? existing.projectRegister,

      donationReceived: existing.donationReceived,
      likes: existing.likes,
      likeCount: existing.likeCount,
      isActive: existing.isActive,

      createdAt: existing.createdAt!,
      updatedAt: new Date(),

      ...(existing.walletId && { walletId: existing.walletId }),
    };

    // ✅ Optional fields – only add if value exists
    if (dto.projectWebsite !== undefined) {
      updated.projectWebsite = dto.projectWebsite;
    }

    if (dto.pitchDeckUrl !== undefined) {
      updated.pitchDeckUrl = dto.pitchDeckUrl;
    }

    if (dto.logoUrl !== undefined) {
      updated.logoUrl = dto.logoUrl;
    }

    if (dto.coverImageUrl !== undefined) {
      updated.coverImageUrl = dto.coverImageUrl;
    }

    if (dto.location !== undefined) {
      updated.location = dto.location;
    }

    return updated;
  }

  static fromMongooseDocumentPopulated(doc: any): PopulatedProjectRepoDTO {
    const projectRepoDTO: PopulatedProjectRepoDTO = {
      _id: doc._id?.toString(),
      userId: doc.userId?._id ? doc.userId._id.toString() : doc.userId?.toString(),
      startupName: doc.startupName,
      shortDescription: doc.shortDescription,
      pitchDeckUrl: doc.pitchDeckUrl ?? "",
      projectWebsite: doc.projectWebsite ?? "",
      userRole: doc.userRole,
      teamSize: doc.teamSize,
      category: doc.category,
      stage: doc.stage,
      logoUrl: doc.logoUrl ?? "",
      coverImageUrl: doc.coverImageUrl ?? "",
      location: doc.location ?? "",
      likes: doc.likes.map((like: any) => ({
        likerId: like.likerId.toString(),
        likerRole: like.likerRole,
      })),
      likeCount: doc.likeCount || 0,
      isActive: doc.isActive ?? true,
      donationEnabled: doc.donationEnabled ?? false,
      donationTarget: doc.donationTarget ?? 0,
      donationReceived: doc.donationReceived ?? 0,
      projectRegister: doc.projectRegister ?? false,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      ...(doc.walletId && { walletId: doc.walletId?.toString() }),
      populatedUser: undefined,
    };

    if (
      doc.userId &&
      typeof doc.userId === "object" &&
      doc.userId.userName &&
      doc.userId.profileImg !== undefined
    ) {
      projectRepoDTO.populatedUser = {
        _id: doc.userId._id.toString(),
        userName: doc.userId.userName,
        profileImg: doc.userId.profileImg || null,
      };
    }

    return projectRepoDTO;
  }
}

import { ProjectRegistrationEntity } from "@domain/entities/project/projectRegistrationEntity";
import {
  ProjectRegistrationResDTO,
  CreateProjectRegistrationEntityDTO,
} from "application/dto/project/projectRegistrationDTO";
import mongoose from "mongoose";
import { ProjectRegistrationStatus } from "@domain/enum/projectRegistrationStatus";
import { IProjectRegistrationModel } from "@infrastructure/db/models/projectRegistrationModel";
import { PopulatedProjectRegistrationRepoDTO } from "application/dto/admin/projectRegistrationRepoDTO";
import { AdminProjectRegistrationDTO } from "application/dto/admin/adminProjectRegistrationDTO";

export class ProjectRegistrationMapper {
  static toEntity(dto: CreateProjectRegistrationEntityDTO): ProjectRegistrationEntity {
    const now = new Date();

    return {
      _id: new mongoose.Types.ObjectId().toString(),

      projectId: dto.projectId,
      founderId: dto.founderId,

      gstCertificateUrl: dto.gstCertificateUrl || "",
      companyRegistrationCertificateUrl: dto.companyRegistrationCertificateUrl || "",
      cinNumber: dto.cinNumber || "",

      country: dto.country,
      declarationAccepted: dto.declarationAccepted,

      status: dto.status ?? ProjectRegistrationStatus.SUBMITTED,

      createdAt: now,
      updatedAt: now,
    };
  }

  static toDTO(entity: ProjectRegistrationEntity): ProjectRegistrationResDTO {
    return {
      _id: entity._id!,

      projectId: entity.projectId,
      founderId: entity.founderId,

      gstCertificateUrl: entity.gstCertificateUrl || "",
      companyRegistrationCertificateUrl: entity.companyRegistrationCertificateUrl || "",
      cinNumber: entity.cinNumber || "",

      country: entity.country,
      declarationAccepted: entity.declarationAccepted,

      status: entity.status,

      createdAt: entity.createdAt!,
      updatedAt: entity.updatedAt!,
    };
  }

  static toMongooseDocument(entity: ProjectRegistrationEntity) {
    return {
      _id: new mongoose.Types.ObjectId(entity._id),

      projectId: new mongoose.Types.ObjectId(entity.projectId),
      founderId: new mongoose.Types.ObjectId(entity.founderId),

      gstCertificateUrl: entity.gstCertificateUrl,
      companyRegistrationCertificateUrl: entity.companyRegistrationCertificateUrl,
      cinNumber: entity.cinNumber,

      country: entity.country,
      declarationAccepted: entity.declarationAccepted,

      status: entity.status,

      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static fromMongooseDocument(doc: IProjectRegistrationModel): ProjectRegistrationEntity {
    return {
      _id: doc._id.toString(),
      projectId: doc.projectId.toString(),
      founderId: doc.founderId.toString(),

      ...(doc.gstCertificateUrl && {
        gstCertificateUrl: doc.gstCertificateUrl,
      }),

      ...(doc.companyRegistrationCertificateUrl && {
        companyRegistrationCertificateUrl: doc.companyRegistrationCertificateUrl,
      }),

      ...(doc.cinNumber && {
        cinNumber: doc.cinNumber,
      }),

      country: doc.country,
      declarationAccepted: doc.declarationAccepted,
      status: doc.status,
      rejectionReason: doc.rejectionReason ?? null,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  static toAdminDTO(repoDTO: PopulatedProjectRegistrationRepoDTO): AdminProjectRegistrationDTO {
    return {
      registrationId: repoDTO._id,

      project: {
        projectId: repoDTO.project._id,
        startupName: repoDTO.project.startupName,
        ...(repoDTO.project.logoUrl && {
          logoUrl: repoDTO.project.logoUrl,
        }),
        ...(repoDTO.project.coverImageUrl && {
          coverImageUrl: repoDTO.project.coverImageUrl,
        }),
      },

      founder: {
        founderId: repoDTO.founder._id,
        userName: repoDTO.founder.userName,
        ...(repoDTO.founder.profileImg && {
          profileImg: repoDTO.founder.profileImg,
        }),
      },

      ...(repoDTO.gstCertificateUrl && {
        gstCertificateUrl: repoDTO.gstCertificateUrl,
      }),

      ...(repoDTO.companyRegistrationCertificateUrl && {
        companyRegistrationCertificateUrl: repoDTO.companyRegistrationCertificateUrl,
      }),

      ...(repoDTO.cinNumber && {
        cinNumber: repoDTO.cinNumber,
      }),

      country: repoDTO.country,
      declarationAccepted: repoDTO.declarationAccepted,
      status: repoDTO.status,
      rejectionReason: repoDTO.rejectionReason ?? null,
      createdAt: repoDTO.createdAt,
    };
  }
}

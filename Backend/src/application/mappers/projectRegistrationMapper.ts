import { ProjectRegistrationEntity } from "@domain/entities/project/projectRegistrationEntity";
import {
  ProjectRegistrationResDTO,
  CreateProjectRegistrationEntityDTO,
} from "application/dto/project/projectRegistrationDTO";
import mongoose from "mongoose";
import { ProjectRegistrationStatus } from "@domain/enum/projectRegistrationStatus";
import { IProjectRegistrationModel } from "@infrastructure/db/models/projectRegistrationModel";

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

      verifyProfile: false,
      status: dto.status ?? ProjectRegistrationStatus.PENDING,

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
      verifyProfile: entity.verifyProfile,
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
      verifyProfile: entity.verifyProfile,
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

      gstCertificateUrl: doc.gstCertificateUrl || "",
      companyRegistrationCertificateUrl: doc.companyRegistrationCertificateUrl || "",
      cinNumber: doc.cinNumber || "",

      country: doc.country,
      verifyProfile: doc.verifyProfile,
      declarationAccepted: doc.declarationAccepted,

      status: doc.status,

      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}

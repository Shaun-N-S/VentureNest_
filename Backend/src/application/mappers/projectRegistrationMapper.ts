import { ProjectRegistrationEntity } from "@domain/entities/project/projectRegistrationEntity";
import {
  ProjectRegistrationResDTO,
  CreateProjectRegistrationEntityDTO,
} from "application/dto/project/projectRegistrationDTO";
import mongoose from "mongoose";
import { ProjectRegistrationStatus } from "@domain/enum/projectRegistrationStatus";
import { IProjectRegistrationModel } from "@infrastructure/db/models/projectRegistrationModel";

export class ProjectRegistrationMapper {
  // ------------------ 1. Create DTO → Entity ------------------
  static toEntity(dto: CreateProjectRegistrationEntityDTO): ProjectRegistrationEntity {
    return {
      _id: new mongoose.Types.ObjectId().toString(),

      project_id: dto.project_id,
      founder_id: dto.founder_id,

      gstCertificateUrl: dto.gstCertificateUrl || "",
      companyRegistrationCertificateUrl: dto.companyRegistrationCertificateUrl || "",
      cin_number: dto.cin_number || "",

      country: dto.country,
      declarationAccepted: dto.declarationAccepted,

      verifyProfile: false,
      status: dto.status ?? ProjectRegistrationStatus.PENDING,

      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  // ------------------ 2. Entity → DTO ------------------
  static toDTO(entity: ProjectRegistrationEntity): ProjectRegistrationResDTO {
    return {
      _id: entity._id!,
      project_id: entity.project_id,
      founder_id: entity.founder_id,

      gstCertificateUrl: entity.gstCertificateUrl || "",
      companyRegistrationCertificateUrl: entity.companyRegistrationCertificateUrl || "",
      cin_number: entity.cin_number || "",

      country: entity.country,
      verifyProfile: entity.verifyProfile,
      declarationAccepted: entity.declarationAccepted,

      status: entity.status,

      createdAt: entity.createdAt || new Date(),
      updatedAt: entity.updatedAt || new Date(),
    };
  }

  // ------------------ 3. Entity → Mongoose Document ------------------
  static toMongooseDocument(entity: ProjectRegistrationEntity) {
    return {
      _id: new mongoose.Types.ObjectId(entity._id),

      project_id: new mongoose.Types.ObjectId(entity.project_id),
      founder_id: new mongoose.Types.ObjectId(entity.founder_id),

      gstCertificateUrl: entity.gstCertificateUrl,
      companyRegistrationCertificateUrl: entity.companyRegistrationCertificateUrl,
      cin_number: entity.cin_number,

      country: entity.country,
      verifyProfile: entity.verifyProfile,
      declarationAccepted: entity.declarationAccepted,

      status: entity.status,

      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  // ------------------ 4. Mongoose Document → Entity ------------------
  static fromMongooseDocument(doc: IProjectRegistrationModel): ProjectRegistrationEntity {
    return {
      _id: doc._id.toString(),
      project_id: doc.project_id?.toString(),
      founder_id: doc.founder_id?.toString(),

      gstCertificateUrl: doc.gstCertificateUrl || "",
      companyRegistrationCertificateUrl: doc.companyRegistrationCertificateUrl || "",
      cin_number: doc.cin_number || "",

      country: doc.country,
      verifyProfile: doc.verifyProfile,
      declarationAccepted: doc.declarationAccepted,

      status: doc.status,

      createdAt: doc.createdAt || new Date(),
      updatedAt: doc.updatedAt || new Date(),
    };
  }
}

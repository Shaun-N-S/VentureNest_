import { InvestorEntity } from "@domain/entities/investor/investorEntity";
import { KYCStatus } from "@domain/enum/kycStatus";
import { UserRole } from "@domain/enum/userRole";
import { UserStatus } from "@domain/enum/userStatus";
import { IInvestorModel } from "@infrastructure/db/models/investorModel";
import { CreateUserDTO } from "application/dto/auth/createUserDTO";
import { LoginUserResponseDTO } from "application/dto/auth/LoginUserDTO";
import { InvestorDTO } from "application/dto/investor/investorDTO";
import {
  InvestorProfileDTO,
  InvestorProfileUpdateResDTO,
} from "application/dto/investor/investorProfileDTO";
import mongoose from "mongoose";

export class InvestorMapper {
  static toEntity(dto: CreateUserDTO): InvestorEntity {
    const now = new Date();
    return {
      _id: new mongoose.Types.ObjectId().toString(),
      userName: dto.userName,
      email: dto.email,
      password: dto.password,
      isFirstLogin: true,
      linkedInUrl: "",
      profileImg: "",
      website: "",
      bio: "",
      interestedTopics: [],
      role: UserRole.INVESTOR,
      status: UserStatus.ACTIVE,
      kycStatus: KYCStatus.PENDING,
      kycRejectReason: "",
      adminVerified: false,
      dateOfBirth: undefined,
      phoneNumber: "",
      address: "",
      aadharImg: "",
      selfieImg: "",
      verifiedAt: undefined,
      kycHistory: [],
      createdAt: now,
      updatedAt: now,

      location: "",
      companyName: "",
      experience: 0,
      preferredSector: [],
      preferredStartupStage: [],
      investmentMin: 0,
      investmentMax: 0,
      portfolioPdf: "",
    };
  }

  static toLoginInvestorResponse(investor: InvestorEntity): LoginUserResponseDTO {
    return {
      _id: investor._id!,
      userName: investor.userName,
      email: investor.email,
      role: investor.role,
      status: investor.status,
      isFirstLogin: investor.isFirstLogin,
      adminVerified: investor.adminVerified,
      kycStatus: investor.kycStatus,
      profileImg: investor.profileImg || "",
    };
  }

  static toDTO(entity: InvestorEntity): InvestorDTO {
    return {
      _id: entity._id!,
      userName: entity.userName,
      email: entity.email,
      role: entity.role,
      status: entity.status,
      adminVerified: entity.adminVerified,
      kycStatus: entity.kycStatus,
      isFirstLogin: entity.isFirstLogin,
      profileImg: entity.profileImg || "",
      createdAt: entity.createdAt || new Date(),
      updatedAt: entity.updatedAt || new Date(),
    };
  }

  static toMongooseDocument(investor: InvestorEntity) {
    return {
      _id: new mongoose.Types.ObjectId(investor._id),
      userName: investor.userName,
      email: investor.email,
      password: investor.password,
      linkedInUrl: investor.linkedInUrl,
      profileImg: investor.profileImg,
      website: investor.website,
      bio: investor.bio,
      interestedTopics: investor.interestedTopics,
      role: investor.role,
      status: investor.status,
      kycStatus: investor.kycStatus,
      kycHistory: investor.kycHistory || [],
      kycRejectReason: investor.kycRejectReason,
      adminVerified: investor.adminVerified,
      dateOfBirth: investor.dateOfBirth,
      phoneNumber: investor.phoneNumber,
      address: investor.address,
      aadharImg: investor.aadharImg,
      selfieImg: investor.selfieImg,
      isFirstLogin: investor.isFirstLogin,
      verifiedAt: investor.verifiedAt,
      createdAt: investor.createdAt,
      updatedAt: investor.updatedAt,

      location: investor.location,
      companyName: investor.companyName,
      experience: investor.experience,
      preferredSector: investor.preferredSector,
      preferredStartupStage: investor.preferredStartupStage,
      investmentMin: investor.investmentMin,
      investmentMax: investor.investmentMax,
      portfolioPdf: investor.portfolioPdf,
    };
  }

  static fromMongooseDocument(doc: IInvestorModel): InvestorEntity {
    return {
      _id: doc._id.toString(),
      userName: doc.userName,
      email: doc.email,
      password: doc.password,
      linkedInUrl: doc.linkedInUrl || "",
      profileImg: doc.profileImg || "",
      aadharImg: doc.aadharImg || "",
      selfieImg: doc.selfieImg || "",
      phoneNumber: doc.phoneNumber || "",
      address: doc.address || "",
      dateOfBirth: doc.dateOfBirth || undefined,
      role: doc.role || UserRole.INVESTOR,
      status: doc.status || UserStatus.ACTIVE,
      kycStatus: doc.kycStatus || KYCStatus.PENDING,
      kycHistory: doc.kycHistory || [],
      kycRejectReason: doc.kycRejectReason || "",
      interestedTopics: doc.interestedTopics || [],
      adminVerified: doc.adminVerified || false,
      isFirstLogin: doc.isFirstLogin ?? true,
      website: doc.website || "",
      bio: doc.bio || "",
      verifiedAt: doc.verifiedAt || undefined,
      createdAt: doc.createdAt || new Date(),
      updatedAt: doc.updatedAt || new Date(),

      location: doc.location || "",
      companyName: doc.companyName || "",
      experience: doc.experience || 0,
      preferredSector: doc.preferredSector || [],
      preferredStartupStage: doc.preferredStartupStage || [],
      investmentMin: doc.investmentMin || 0,
      investmentMax: doc.investmentMax || 0,
      portfolioPdf: doc.portfolioPdf || "",
    };
  }

  static investorProfileDatatoDTO(data: InvestorEntity): InvestorProfileDTO {
    return {
      userName: data.userName,
      profileImg: data.profileImg || "",
      bio: data.bio || "",
      website: data.website || "",
      companyName: data.companyName,
      experience: data.experience,
      location: data.location,
      investmentMin: data.investmentMin,
      investmentMax: data.investmentMax,
      adminVerified: data.adminVerified,
      linkedInUrl: data.linkedInUrl || "",
    };
  }

  static investorProfileUpdateResDTO(data: InvestorEntity): InvestorProfileUpdateResDTO {
    return {
      userName: data.userName,
      bio: data.bio || "",
      website: data.website || "",
      linkedInUrl: data.linkedInUrl || "",
      companyName: data.companyName,
      adminVerified: data.adminVerified,
      profileImg: data.profileImg || "",
    };
  }
}

import { KYCStatus } from "@domain/enum/kycStatus";
import { IUserModel } from "@infrastructure/db/models/userModel";
import { CreateUserDTO } from "application/dto/auth/createUserDTO";
import { LoginAdminResponseDTO } from "application/dto/auth/LoginAdminDTO";
import { LoginUserResponseDTO } from "application/dto/auth/LoginUserDTO";
import { UserDTO } from "application/dto/user/userDTO";
import { UserProfileUpdateResDTO } from "application/dto/user/userProfileUpdateDTO";
import { UserEntity } from "domain/entities/user/userEntity";
import { UserRole } from "domain/enum/userRole";
import { UserStatus } from "domain/enum/userStatus";
import mongoose from "mongoose";

export class UserMapper {
  static toEntity(dto: CreateUserDTO): UserEntity {
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
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
      kycStatus: KYCStatus.PENDING,
      adminVerified: false,
      dateOfBirth: undefined,
      phoneNumber: "",
      address: "",
      aadharImg: "",
      selfieImg: "",
      verifiedAt: undefined,
      googleId: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  static toDTO(entity: UserEntity): UserDTO {
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
      updatedAt: entity.createdAt || new Date(),
    };
  }

  static toLoginUserResponse(user: UserEntity): LoginUserResponseDTO {
    return {
      _id: user._id!,
      userName: user.userName,
      email: user.email,
      role: user.role,
      status: user.status,
      isFirstLogin: user.isFirstLogin,
      adminVerified: user.adminVerified,
      kycStatus: user.kycStatus,
      profileImg: user.profileImg || "",
    };
  }

  static toLoginAdminResponse(user: UserEntity): LoginAdminResponseDTO {
    return {
      _id: user._id!,
      userName: user.userName,
      email: user.email,
      role: user.role,
      status: user.status,
    };
  }

  static toMongooseDocument(user: UserEntity) {
    return {
      _id: new mongoose.Types.ObjectId(user._id),
      userName: user.userName,
      email: user.email,
      password: user.password,
      linkedInUrl: user.linkedInUrl,
      profileImg: user.profileImg,
      website: user.website,
      bio: user.bio,
      interestedTopics: user.interestedTopics,
      role: user.role,
      status: user.status,
      adminVerified: user.adminVerified,
      kycStatus: user.kycStatus,
      kycHistory: user.kycHistory || [],
      kycRejectReason: user.kycRejectReason,
      dateOfBirth: user.dateOfBirth,
      phoneNumber: user.phoneNumber,
      address: user.address,
      aadharImg: user.aadharImg,
      selfieImg: user.selfieImg,
      isFirstLogin: user.isFirstLogin,
      verifiedAt: user.verifiedAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static fromMongooseDocument(doc: IUserModel): UserEntity {
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
      dateOfBirth: doc.dateOfBirth || new Date(0),
      role: doc.role || UserRole.USER,
      status: doc.status || UserStatus.ACTIVE,
      kycStatus: doc.kycStatus || KYCStatus.PENDING,
      kycHistory: doc.kycHistory || [],
      kycRejectReason: doc.kycRejectReason || "",
      interestedTopics: doc.interestedTopics || [],
      adminVerified: doc.adminVerified || false,
      isFirstLogin: doc.isFirstLogin ?? true,
      website: doc.website || "",
      bio: doc.bio || "",
      verifiedAt: doc.verifiedAt || new Date(0),
      createdAt: doc.createdAt || new Date(),
      updatedAt: doc.updatedAt || new Date(),
    };
  }

  static userProfileUpdateRes(data: UserEntity): UserProfileUpdateResDTO {
    return {
      userName: data.userName,
      bio: data.bio || "",
      profileImg: data.profileImg || "",
      website: data.website || "",
      linkedInUrl: data.linkedInUrl || "",
      kycRejectReason: data.kycRejectReason || "",
      adminVerified: data.adminVerified,
      kycStatus: data.kycStatus,
    };
  }

  static userProfileData(data: UserEntity): UserProfileUpdateResDTO {
    return {
      userName: data.userName,
      bio: data.bio || "",
      profileImg: data.profileImg || "",
      website: data.website || "",
      linkedInUrl: data.linkedInUrl || "",
      adminVerified: data.adminVerified,
      kycStatus: data.kycStatus,
    };
  }
}

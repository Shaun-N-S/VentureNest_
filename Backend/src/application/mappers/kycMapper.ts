import { InvestorEntity } from "@domain/entities/investor/investorEntity";
import { UserEntity } from "@domain/entities/user/userEntity";
import { KycDTO } from "application/dto/admin/kycDTO";

export class KycMapper {
  static userKycRes(data: UserEntity): KycDTO {
    return {
      _id: data._id!,
      userName: data.userName,
      email: data.email,
      role: data.role,
      status: data.status,
      adminVerified: data.adminVerified,
      kycStatus: data.kycStatus,

      profileImg: data.profileImg || undefined,
      selfieImg: data.selfieImg || undefined,
      aadharImg: data.aadharImg || undefined,
      website: data.website || undefined,
      phoneNumber: data.phoneNumber || undefined,
      address: data.address || undefined,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
      linkedInUrl: data.linkedInUrl || undefined,
    };
  }
  static investorKycRes(data: InvestorEntity): KycDTO {
    return {
      _id: data._id!,
      userName: data.userName,
      email: data.email,
      role: data.role,
      status: data.status,
      adminVerified: data.adminVerified,
      kycStatus: data.kycStatus,

      profileImg: data.profileImg || undefined,
      selfieImg: data.selfieImg || undefined,
      aadharImg: data.aadharImg || undefined,
      website: data.website || undefined,
      phoneNumber: data.phoneNumber || undefined,
      address: data.address || undefined,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
      linkedInUrl: data.linkedInUrl || undefined,

      investmentMin: data.investmentMin || undefined,
      investmentMax: data.investmentMax || undefined,
      companyName: data.companyName || undefined,
      location: data.location || undefined,
    };
  }
}

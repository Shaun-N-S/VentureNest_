import { UserEntity } from "domain/entities/user/userEntity";
import { IBaseRepository } from "./IBaseRepository";
import { UserStatus } from "@domain/enum/userStatus";
import { KYCStatus } from "@domain/enum/kycStatus";

export interface IUserRepository extends IBaseRepository<UserEntity> {
  findByEmail(email: string): Promise<UserEntity | null>;
  findByIdAndUpdatePassword(email: string, password: string): Promise<void>;
  updateStatus(userId: string, status: UserStatus): Promise<UserEntity | null>;
  updateKycStatus(userId: string, status: KYCStatus, reason?: string): Promise<UserEntity | null>;
  googleSignUp(user: UserEntity): Promise<string>;
  setInterestedTopics(userId: string, interestedTopics: string[]): Promise<void>;
}

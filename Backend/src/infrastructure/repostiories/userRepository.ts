import { UserEntity } from "domain/entities/user/userEntity";
import { BaseRepository } from "./baseRepository";
import { IUserRepository } from "domain/interfaces/repositories/IUserRepository";
import { Model } from "mongoose";
import { UserMapper } from "application/mappers/userMappers";
import { IUserModel } from "@infrastructure/db/models/userModel";
import { UserStatus } from "@domain/enum/userStatus";
import { UserRole } from "@domain/enum/userRole";
import { KYCStatus } from "@domain/enum/kycStatus";

export class UserRepository
  extends BaseRepository<UserEntity, IUserModel>
  implements IUserRepository
{
  constructor(protected _model: Model<IUserModel>) {
    super(_model, UserMapper);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const doc = await this._model.findOne({ email });
    if (!doc) return null;
    return UserMapper.fromMongooseDocument(doc);
  }

  async findByIdAndUpdatePassword(email: string, password: string): Promise<void> {
    await this._model.updateOne({ email }, { $set: { password } });
  }

  async findAll(skip = 0, limit = 10, status?: string, search?: string): Promise<UserEntity[]> {
    return super.findAll(skip, limit, status, search, { role: UserRole.USER });
  }

  async count(status?: string, search?: string): Promise<number> {
    return super.count(status, search, { role: UserRole.USER });
  }

  async updateStatus(userId: string, status: UserStatus): Promise<UserEntity | null> {
    const updatedDoc = await this._model.findByIdAndUpdate(userId, { status }, { new: true });
    if (!updatedDoc) return null;
    return UserMapper.fromMongooseDocument(updatedDoc);
  }

  async googleSignUp(user: UserEntity): Promise<string> {
    const newUser = await this._model.create(user);
    return newUser._id.toString();
  }

  async setInterestedTopics(userId: string, interestedTopics: string[]): Promise<void> {
    await this._model.updateOne(
      { _id: userId },
      { $set: { interestedTopics, isFirstLogin: false } },
      { upsert: true }
    );
  }

  async updateKycStatus(userId: string, kycStatus: KYCStatus): Promise<UserEntity | null> {
    const updatedUser = await this._model.findByIdAndUpdate(userId, { kycStatus }, { new: true });
    if (!updatedUser) return null;
    return UserMapper.fromMongooseDocument(updatedUser);
  }
}

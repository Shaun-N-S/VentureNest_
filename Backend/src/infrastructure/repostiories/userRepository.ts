import { UserEntity } from "domain/entities/user/userEntity";
import { BaseRepository } from "./baseRepository";
import { IUserRepository } from "domain/interfaces/repositories/IUserRepository";
import mongoose, { Model } from "mongoose";
import { UserMapper } from "application/mappers/userMappers";
import { IUserModel } from "@infrastructure/db/models/userModel";
import { UserStatus } from "@domain/enum/userStatus";
import { UserRole } from "@domain/enum/userRole";
import { KYCStatus } from "@domain/enum/kycStatus";
import { NotFoundExecption } from "application/constants/exceptions";
import { USER_ERRORS } from "@shared/constants/error";

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

  async findAll(skip = 0, limit = 10, status?: string, search?: string, extraQuery: any = {}) {
    return super.findAll(skip, limit, status, search, { ...extraQuery, role: UserRole.USER });
  }

  async count(status?: string, search?: string, extraQuery: any = {}) {
    return super.count(status, search, { role: UserRole.USER, ...extraQuery });
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

  async updateKycStatus(
    userId: string,
    kycStatus: KYCStatus,
    reason?: string
  ): Promise<UserEntity | null> {
    const updateData: any = { kycStatus };

    if (kycStatus === KYCStatus.REJECTED && reason) {
      updateData.kycRejectReason = reason;
    }

    if (kycStatus === KYCStatus.APPROVED) {
      updateData.adminVerified = true;
      updateData.kycRejectReason = null;
    }

    const updatedUser = await this._model.findByIdAndUpdate(
      userId,
      {
        $set: updateData,
        ...(reason && kycStatus === KYCStatus.REJECTED
          ? {
              $push: {
                kycHistory: {
                  status: kycStatus,
                  reason,
                  date: new Date(),
                },
              },
            }
          : {}),
      },
      { new: true }
    );

    if (!updatedUser) return null;
    return UserMapper.fromMongooseDocument(updatedUser);
  }

  async getStatus(userId: string): Promise<UserStatus> {
    const doc = await this._model.findById(userId, { status: 1 });

    if (!doc) {
      throw new NotFoundExecption(USER_ERRORS.USER_NOT_FOUND);
    }

    return doc.status;
  }

  async findByIdsPaginated(ids: string[], skip: number, limit: number, search?: string) {
    const query: any = {
      _id: { $in: ids.map((id) => new mongoose.Types.ObjectId(id)) },
    };

    if (search) {
      query.userName = { $regex: search, $options: "i" };
    }

    const docs = await this._model.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });

    return docs.map((doc) => UserMapper.fromMongooseDocument(doc));
  }

  async countByIds(ids: string[], search?: string) {
    const query: any = {
      _id: { $in: ids.map((id) => new mongoose.Types.ObjectId(id)) },
    };

    if (search) {
      query.userName = { $regex: search, $options: "i" };
    }

    return this._model.countDocuments(query);
  }

  async findByRole(role: UserRole): Promise<UserEntity | null> {
    const doc = await this._model.findOne({ role });

    if (!doc) return null;

    return UserMapper.fromMongooseDocument(doc);
  }
}

import { InvestorEntity } from "@domain/entities/investor/investorEntity";
import { BaseRepository } from "./baseRepository";
import { IInvestorRepository } from "@domain/interfaces/repositories/IInvestorRespository";
import mongoose, { Model } from "mongoose";
import { InvestorMapper } from "application/mappers/investorMapper";
import { IInvestorModel } from "@infrastructure/db/models/investorModel";
import { UserStatus } from "@domain/enum/userStatus";
import { KYCStatus } from "@domain/enum/kycStatus";
import { UserRole } from "@domain/enum/userRole";
import { NotFoundExecption } from "application/constants/exceptions";
import { INVESTOR_ERRORS } from "@shared/constants/error";

export class InvestorRepository
  extends BaseRepository<InvestorEntity, IInvestorModel>
  implements IInvestorRepository
{
  constructor(protected _model: Model<IInvestorModel>) {
    super(_model, InvestorMapper);
  }

  async findByEmail(email: string): Promise<InvestorEntity | null> {
    const doc = await this._model.findOne({ email });
    if (!doc) return null;
    return InvestorMapper.fromMongooseDocument(doc);
  }

  async findByIdAndUpdatePassword(email: string, password: string): Promise<void> {
    await this._model.updateOne({ email }, { $set: { password } });
  }

  async updateStatus(investorId: string, status: UserStatus): Promise<InvestorEntity | null> {
    const updatedDoc = await this._model.findByIdAndUpdate(investorId, { status }, { new: true });
    if (!updatedDoc) return null;
    return InvestorMapper.fromMongooseDocument(updatedDoc);
  }

  async findAll(skip = 0, limit = 10, status?: string, search?: string, extraQuery: any = {}) {
    return super.findAll(skip, limit, status, search, {
      ...extraQuery,
      role: UserRole.INVESTOR,
    });
  }

  async count(status?: string, search?: string, extraQuery: any = {}) {
    return super.count(status, search, { role: UserRole.INVESTOR, ...extraQuery });
  }

  async profileCompletion(
    id: string,
    data: Partial<InvestorEntity>
  ): Promise<InvestorEntity | null> {
    const updatedDoc = await this._model.findByIdAndUpdate(id, data, { new: true });
    if (!updatedDoc) return null;
    return InvestorMapper.fromMongooseDocument(updatedDoc);
  }

  async googleSignUp(investor: InvestorEntity): Promise<string> {
    const newInvestor = await this._model.create(investor);
    return newInvestor._id.toString();
  }

  async setInterestedTopics(investorId: string, interestedTopics: string[]): Promise<void> {
    await this._model.updateOne(
      { _id: investorId },
      { $set: { interestedTopics, isFirstLogin: false } },
      { upsert: true }
    );
  }

  async updateKycStatus(
    investorId: string,
    kycStatus: KYCStatus,
    reason?: string
  ): Promise<InvestorEntity | null> {
    const updateData: any = { kycStatus };

    if (kycStatus === KYCStatus.REJECTED && reason) {
      updateData.kycRejectReason = reason;
    }

    if (kycStatus === KYCStatus.APPROVED) {
      updateData.adminVerified = true;
      updateData.kycRejectReason = reason;
    }

    const udpatedInvestor = await this._model.findByIdAndUpdate(
      investorId,
      {
        $set: updateData,
        ...(reason && kycStatus === KYCStatus.REJECTED
          ? { $push: { kycHistory: { status: kycStatus, reason, date: new Date() } } }
          : {}),
      },
      { new: true }
    );

    if (!udpatedInvestor) return null;
    return InvestorMapper.fromMongooseDocument(udpatedInvestor);
  }

  async getStatus(investorId: string): Promise<UserStatus> {
    const doc = await this._model.findById(investorId, { status: 1 });

    if (!doc) {
      throw new NotFoundExecption(INVESTOR_ERRORS.INVESTOR_NOT_FOUND);
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

    return docs.map(InvestorMapper.fromMongooseDocument);
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
}

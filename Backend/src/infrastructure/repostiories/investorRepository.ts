import { InvestorEntity } from "@domain/entities/investor/investorEntity";
import { BaseRepository } from "./baseRepository";
import { IInvestorRepository } from "@domain/interfaces/repositories/IInvestorRespository";
import { Model } from "mongoose";
import { InvestorMapper } from "application/mappers/investorMapper";
import { IInvestorModel } from "@infrastructure/db/models/investorModel";
import { UserStatus } from "@domain/enum/userStatus";

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

  async updateById(id: string, data: Partial<InvestorEntity>): Promise<InvestorEntity | null> {
    const updatedDoc = await this._model.findByIdAndUpdate(id, data, { new: true });
    if (!updatedDoc) return null;
    return InvestorMapper.fromMongooseDocument(updatedDoc);
  }

  async googleSignUp(investor: InvestorEntity): Promise<string> {
    const newInvestor = await this._model.create(investor);
    return newInvestor._id.toString();
  }
}

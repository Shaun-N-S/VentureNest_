// import { IInvestorModel } from "@infrastructure/db/models/investorModel";
// import { BaseRepository } from "./baseRepository";
// import { IInvestorRepository } from "@domain/interfaces/repositories/IInvestorRespository";
// import { InvestorEntity } from "@domain/entities/investor/investorEntity";
// import { InvestorMapper } from "application/mappers/investorMapper";
// import { Model } from "mongoose";

// export class InvestorRepository
//   extends BaseRepository<InvestorEntity, IInvestorModel>
//   implements IInvestorRepository
// {
//   constructor(protected _model: Model<IInvestorModel>) {
//     super(_model);
//   }

//   async findByEmail(email: string): Promise<InvestorEntity | null> {
//     const doc = await this._model.findOne({ email });
//     if (!doc) return null;
//     return InvestorMapper.fromMongooseDocument(doc);
//   }
// }

import { IInvestorModel } from "@infrastructure/db/models/investorModel";
import { BaseRepository } from "./baseRepository";
import { IInvestorRepository } from "@domain/interfaces/repositories/IInvestorRespository";
import { InvestorEntity } from "@domain/entities/investor/investorEntity";
import { InvestorMapper } from "application/mappers/investorMapper";
import { Model } from "mongoose";

export class InvestorRepository
  extends BaseRepository<InvestorEntity, IInvestorModel>
  implements IInvestorRepository
{
  constructor(protected _model: Model<IInvestorModel>) {
    super(_model);
  }

  async save(data: InvestorEntity): Promise<InvestorEntity> {
    const doc = InvestorMapper.toMongooseDocument(data);
    const saved = await this._model.create(doc);
    return InvestorMapper.fromMongooseDocument(saved);
  }

  async findById(id: string): Promise<InvestorEntity | null> {
    const doc = await this._model.findById(id);
    if (!doc) return null;
    return InvestorMapper.fromMongooseDocument(doc);
  }

  async findByEmail(email: string): Promise<InvestorEntity | null> {
    const doc = await this._model.findOne({ email });
    if (!doc) return null;
    return InvestorMapper.fromMongooseDocument(doc);
  }
}

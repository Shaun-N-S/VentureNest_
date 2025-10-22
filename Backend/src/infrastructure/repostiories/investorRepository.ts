// import { IInvestorModel } from "@infrastructure/db/models/investorModel";
// import { BaseRepository } from "./baseRepository";
// import { IInvestorRepository } from "@domain/interfaces/repositories/IInvestorRespository";
// import { InvestorEntity } from "@domain/entities/investor/investorEntity";
// import { InvestorMapper } from "application/mappers/investorMapper";
// import { Model } from "mongoose";
// import { UserStatus } from "@domain/enum/userStatus";

// export class InvestorRepository
//   extends BaseRepository<InvestorEntity, IInvestorModel>
//   implements IInvestorRepository
// {
//   constructor(protected _model: Model<IInvestorModel>) {
//     super(_model);
//   }

//   async save(data: InvestorEntity): Promise<InvestorEntity> {
//     const doc = InvestorMapper.toMongooseDocument(data);
//     const saved = await this._model.create(doc);
//     return InvestorMapper.fromMongooseDocument(saved);
//   }

//   async findById(id: string): Promise<InvestorEntity | null> {
//     const doc = await this._model.findById(id);
//     if (!doc) return null;
//     return InvestorMapper.fromMongooseDocument(doc);
//   }

//   async findByEmail(email: string): Promise<InvestorEntity | null> {
//     const doc = await this._model.findOne({ email });
//     if (!doc) return null;
//     return InvestorMapper.fromMongooseDocument(doc);
//   }

//   async findByIdAndUpdatePassword(email: string, password: string): Promise<void> {
//     await this._model.updateOne({ email }, { $set: { password } });
//   }

//   async findAll(skip = 0, limit = 10, status?: string, search?: string): Promise<InvestorEntity[]> {
//     const query: any = {};

//     if (status) query.status = status;
//     if (search) {
//       query.$or = [
//         { name: { $regex: search, $options: "i" } },
//         { email: { $regex: search, $options: "i" } },
//       ];
//     }

//     const docs = await this._model.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });

//     return docs.map((doc) => InvestorMapper.fromMongooseDocument(doc));
//   }

//   async count(status?: string, search?: string): Promise<number> {
//     const query: any = {};

//     if (status) query.status = status;
//     if (search) {
//       query.$or = [
//         { name: { $regex: search, $options: "i" } },
//         { email: { $regex: search, $options: "i" } },
//       ];
//     }

//     return await this._model.countDocuments(query);
//   }

//   async updateStatus(investorId: string, status: UserStatus): Promise<InvestorEntity | null> {
//     const updatedDoc = await this._model.findByIdAndUpdate(investorId, { status }, { new: true });

//     if (!updatedDoc) return null;
//     return InvestorMapper.fromMongooseDocument(updatedDoc);
//   }
// }

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
}

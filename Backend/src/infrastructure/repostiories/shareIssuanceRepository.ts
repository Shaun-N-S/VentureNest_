import { Model } from "mongoose";
import { BaseRepository } from "./baseRepository";
import { IShareIssuanceRepository } from "@domain/interfaces/repositories/IShareIssuanceRepository";
import { IShareIssuanceModel } from "@infrastructure/db/models/shareIssuanceModel";
import { ShareIssuanceMapper } from "application/mappers/shareIssuanceMapper";
import { ShareIssuanceEntity } from "@domain/entities/investor/shareIssuanceEntity";
import { Types } from "mongoose";

export class ShareIssuanceRepository
  extends BaseRepository<ShareIssuanceEntity, IShareIssuanceModel>
  implements IShareIssuanceRepository
{
  constructor(protected _model: Model<IShareIssuanceModel>) {
    super(_model, ShareIssuanceMapper);
  }

  async findByProjectId(projectId: string): Promise<ShareIssuanceEntity[]> {
    const docs = await this._model
      .find({ projectId: new Types.ObjectId(projectId) })
      .sort({ issuedAt: -1 });

    return docs.map(ShareIssuanceMapper.fromMongooseDocument);
  }

  async findByDealId(dealId: string): Promise<ShareIssuanceEntity[]> {
    const docs = await this._model
      .find({ dealId: new Types.ObjectId(dealId) })
      .sort({ issuedAt: -1 });

    return docs.map(ShareIssuanceMapper.fromMongooseDocument);
  }
}

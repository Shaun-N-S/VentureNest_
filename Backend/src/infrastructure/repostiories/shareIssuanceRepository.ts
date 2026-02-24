import { Model } from "mongoose";
import { BaseRepository } from "./baseRepository";
import { IShareIssuanceRepository } from "@domain/interfaces/repositories/IShareIssuanceRepository";
import { IShareIssuanceModel } from "@infrastructure/db/models/shareIssuanceModel";
import { ShareIssuanceMapper } from "application/mappers/shareIssuanceMapper";
import { ShareIssuanceEntity } from "@domain/entities/investor/shareIssuanceEntity";

export class ShareIssuanceRepository
  extends BaseRepository<ShareIssuanceEntity, IShareIssuanceModel>
  implements IShareIssuanceRepository
{
  constructor(protected _model: Model<IShareIssuanceModel>) {
    super(_model, ShareIssuanceMapper);
  }

  async findByProjectId(projectId: string) {
    const docs = await this._model.find({ projectId });
    return docs.map(ShareIssuanceMapper.fromMongooseDocument);
  }

  async findByDealId(dealId: string) {
    const docs = await this._model.find({ dealId });
    return docs.map(ShareIssuanceMapper.fromMongooseDocument);
  }
}

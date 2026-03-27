import { Model } from "mongoose";
import { BaseRepository } from "./baseRepository";
import { WithdrawalEntity } from "@domain/entities/wallet/withdrawalEntity";
import { IWithdrawalRepository } from "@domain/interfaces/repositories/IWithdrawalRepository";
import { IWithdrawalModel } from "@infrastructure/db/models/withdrawalModel";
import { WithdrawalMapper } from "application/mappers/withdrawalMapper";
import { PopulatedWithdrawal } from "@infrastructure/types/populatedWithdrawal";

export class WithdrawalRepository
  extends BaseRepository<WithdrawalEntity, IWithdrawalModel>
  implements IWithdrawalRepository
{
  constructor(protected _model: Model<IWithdrawalModel>) {
    super(_model, WithdrawalMapper);
  }

  async findAllPaginated(
    filter: Partial<WithdrawalEntity>,
    skip: number,
    limit: number,
    search?: string
  ): Promise<PopulatedWithdrawal[]> {
    const query: any = { ...filter };

    const projectMatch: any = {};

    if (search) {
      const regex = new RegExp(search, "i");

      projectMatch.$or = [{ startupName: regex }];
    }

    const docs = await this._model
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "projectId",
        match: projectMatch,
        select: "startupName logoUrl userId",
        populate: {
          path: "userId",
          select: "userName profileImg",
        },
      })
      .lean();

    const filtered = docs.filter((doc) => doc.projectId !== null);

    return filtered as unknown as PopulatedWithdrawal[];
  }

  async countWithSearch(filter: Partial<WithdrawalEntity>, search?: string): Promise<number> {
    const query: any = { ...filter };

    const projectMatch: any = {};

    if (search) {
      const regex = new RegExp(search, "i");

      projectMatch.$or = [{ startupName: regex }];
    }

    const docs = await this._model
      .find(query)
      .populate({
        path: "projectId",
        match: projectMatch,
        populate: {
          path: "userId",
        },
      })
      .lean();

    return docs.filter((doc) => doc.projectId !== null).length;
  }
}

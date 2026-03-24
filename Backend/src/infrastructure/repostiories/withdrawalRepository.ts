import { Model } from "mongoose";
import { BaseRepository } from "./baseRepository";
import { WithdrawalEntity } from "@domain/entities/wallet/withdrawalEntity";
import { IWithdrawalRepository } from "@domain/interfaces/repositories/IWithdrawalRepository";
import { IWithdrawalModel } from "@infrastructure/db/models/withdrawalModel";
import { WithdrawalMapper } from "application/mappers/withdrawalMapper";

export class WithdrawalRepository
  extends BaseRepository<WithdrawalEntity, IWithdrawalModel>
  implements IWithdrawalRepository
{
  constructor(protected _model: Model<IWithdrawalModel>) {
    super(_model, WithdrawalMapper);
  }
}

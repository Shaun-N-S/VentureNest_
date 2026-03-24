import { WithdrawalEntity } from "@domain/entities/wallet/withdrawalEntity";
import { IBaseRepository } from "./IBaseRepository";

export interface IWithdrawalRepository extends IBaseRepository<WithdrawalEntity> {}

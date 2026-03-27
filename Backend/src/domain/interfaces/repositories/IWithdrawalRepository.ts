import { WithdrawalEntity } from "@domain/entities/wallet/withdrawalEntity";
import { IBaseRepository } from "./IBaseRepository";
import { PopulatedWithdrawal } from "@infrastructure/types/populatedWithdrawal";

export interface IWithdrawalRepository extends IBaseRepository<WithdrawalEntity> {
  findAllPaginated(
    filter: Partial<WithdrawalEntity>,
    skip: number,
    limit: number,
    search?: string
  ): Promise<PopulatedWithdrawal[]>;

  countWithSearch(filter: Partial<WithdrawalEntity>, search?: string): Promise<number>;
}

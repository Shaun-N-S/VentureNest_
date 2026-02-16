import { DealInstallmentEntity } from "@domain/entities/deal/dealInstallmentEntity";
import { IBaseRepository } from "./IBaseRepository";

export interface IDealInstallmentRepository extends IBaseRepository<DealInstallmentEntity> {
  findByDealId(dealId: string): Promise<DealInstallmentEntity[]>;
}

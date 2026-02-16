import { DealEntity } from "@domain/entities/deal/dealEntity";
import { IBaseRepository } from "./IBaseRepository";

export interface IDealRepository extends IBaseRepository<DealEntity> {
  findByOfferId(offerId: string): Promise<DealEntity | null>;

  incrementPaidAmount(dealId: string, amount: number): Promise<void>;
}

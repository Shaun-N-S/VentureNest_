import { DealEntity } from "@domain/entities/deal/dealEntity";
import { IBaseRepository } from "./IBaseRepository";
import { ClientSession } from "mongoose";

export interface IDealRepository extends IBaseRepository<DealEntity> {
  findByOfferId(offerId: string): Promise<DealEntity | null>;

  incrementPaidAmount(dealId: string, amount: number, session?: ClientSession): Promise<void>;
}

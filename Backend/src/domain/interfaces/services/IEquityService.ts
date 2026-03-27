import { DealEntity } from "@domain/entities/deal/dealEntity";
import { ClientSession } from "mongoose";

export interface IEquityService {
  allocateEquity(
    deal: DealEntity,
    installmentAmount: number,
    session: ClientSession
  ): Promise<void>;
}

import { PaymentPurpose } from "@domain/enum/paymentPurpose";
import { IBaseRepository } from "./IBaseRepository";
import { PaymentEntity } from "@domain/entities/payment/paymentEntity";

export interface IPaymentRepository extends IBaseRepository<PaymentEntity> {
  findBySessionId(sessionId: string): Promise<PaymentEntity | null>;
  sumByPurpose(purpose: string): Promise<number>;
  getRevenueByPurposeWithFilter(
    purpose: PaymentPurpose,
    filter: {
      fromDate?: Date;
      toDate?: Date;
      year?: number;
      month?: number;
    }
  ): Promise<{ _id: number; total: number }[]>;
}

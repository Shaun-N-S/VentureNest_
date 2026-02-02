import { IBaseRepository } from "./IBaseRepository";
import { PaymentEntity } from "@domain/entities/payment/paymentEntity";

export interface IPaymentRepository extends IBaseRepository<PaymentEntity> {
  findBySessionId(sessionId: string): Promise<PaymentEntity | null>;
}

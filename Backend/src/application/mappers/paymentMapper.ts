import mongoose from "mongoose";
import { PaymentEntity } from "@domain/entities/payment/paymentEntity";
import { PaymentDTO } from "application/dto/payment/paymentDTO";
import { IPaymentModel } from "@infrastructure/db/models/paymentModel";

export class PaymentMapper {
  static toMongooseDocument(entity: PaymentEntity) {
    return {
      sessionId: entity.sessionId,
      dealId: entity.dealId ? new mongoose.Types.ObjectId(entity.dealId) : undefined,
      ownerId: new mongoose.Types.ObjectId(entity.ownerId),
      ownerRole: entity.ownerRole,
      planId: entity.planId ? new mongoose.Types.ObjectId(entity.planId) : undefined,
      amount: entity.amount,
      purpose: entity.purpose,
    };
  }

  static fromMongooseDocument(doc: IPaymentModel): PaymentEntity {
    return {
      id: doc.id.toString(),
      sessionId: doc.sessionId,
      ...(doc.dealId && { dealId: doc.dealId.toString() }),
      ownerId: doc.ownerId.toString(),
      ownerRole: doc.ownerRole,
      ...(doc.planId && { planId: doc.planId.toString() }),
      purpose: doc.purpose,
      amount: doc.amount,
      createdAt: doc.createdAt,
    };
  }

  /* Domain → DTO */
  static toDTO(entity: PaymentEntity): PaymentDTO {
    return {
      id: entity.id!,
      ...(entity.planId && { planId: entity.planId }),
      amount: entity.amount,
      purpose: entity.purpose,
      createdAt: entity.createdAt!,
    };
  }
}

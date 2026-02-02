import mongoose from "mongoose";
import { PaymentEntity } from "@domain/entities/payment/paymentEntity";
import { PaymentDTO } from "application/dto/payment/paymentDTO";
import { IPaymentModel } from "@infrastructure/db/models/paymentModel";

export class PaymentMapper {
  static toMongooseDocument(entity: PaymentEntity) {
    return {
      sessionId: entity.sessionId,
      ownerId: new mongoose.Types.ObjectId(entity.ownerId),
      ownerRole: entity.ownerRole,
      planId: new mongoose.Types.ObjectId(entity.planId),
      amount: entity.amount,
    };
  }

  static fromMongooseDocument(doc: IPaymentModel): PaymentEntity {
    return {
      id: doc.id.toString(),
      sessionId: doc.sessionId,
      ownerId: doc.ownerId.toString(),
      ownerRole: doc.ownerRole,
      planId: doc.planId.toString(),
      amount: doc.amount,
      createdAt: doc.createdAt,
    };
  }

  /* Domain → DTO */
  static toDTO(entity: PaymentEntity): PaymentDTO {
    return {
      id: entity.id!,
      planId: entity.planId,
      amount: entity.amount,
      createdAt: entity.createdAt!,
    };
  }
}

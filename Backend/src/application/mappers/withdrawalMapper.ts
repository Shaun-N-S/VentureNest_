import mongoose from "mongoose";
import { WithdrawalEntity } from "@domain/entities/wallet/withdrawalEntity";
import { WithdrawalResponseDTO } from "application/dto/wallet/withdrawalDTO";
import { IWithdrawalModel } from "@infrastructure/db/models/withdrawalModel";

export class WithdrawalMapper {
  static toMongooseDocument(entity: WithdrawalEntity) {
    return {
      _id: entity._id ? new mongoose.Types.ObjectId(entity._id) : undefined,
      projectId: new mongoose.Types.ObjectId(entity.projectId),
      walletId: new mongoose.Types.ObjectId(entity.walletId),
      amount: entity.amount,
      reason: entity.reason,
      status: entity.status,
      createdAt: entity.createdAt,
      processedAt: entity.processedAt,
    };
  }

  static fromMongooseDocument(doc: IWithdrawalModel): WithdrawalEntity {
    return {
      _id: doc._id.toString(),
      projectId: doc.projectId.toString(),
      walletId: doc.walletId.toString(),
      amount: doc.amount,
      reason: doc.reason,
      status: doc.status,
      createdAt: doc.createdAt,
      ...(doc.processedAt && { processedAt: doc.processedAt }),
    };
  }

  static toResponseDTO(entity: WithdrawalEntity): WithdrawalResponseDTO {
    return {
      withdrawalId: entity._id!,
      amount: entity.amount,
      status: entity.status,
      createdAt: entity.createdAt!,
    };
  }
}

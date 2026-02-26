import { TransactionEntity } from "@domain/entities/Transaction/transactionEntity";
import { AdminTransactionDTO } from "application/dto/admin/adminTransactionDTO";

export class AdminTransactionMapper {
  static toDTO(entity: TransactionEntity): AdminTransactionDTO {
    const dto: AdminTransactionDTO = {
      id: entity._id!,
      amount: entity.amount,
      action: entity.action,
      reason: entity.reason,
      status: entity.status,
      createdAt: entity.createdAt!,
    };

    if (entity.fromWalletId) {
      dto.fromWalletId = entity.fromWalletId;
    }

    if (entity.toWalletId) {
      dto.toWalletId = entity.toWalletId;
    }

    if (entity.relatedDealId) {
      dto.relatedDealId = entity.relatedDealId;
    }

    return dto;
  }
}

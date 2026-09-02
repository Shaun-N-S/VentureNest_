import { AdminTransactionListItem } from "@domain/interfaces/repositories/ITransactionRepository";
import { AdminTransactionDTO } from "application/dto/admin/adminTransactionDTO";

export class AdminTransactionMapper {
  static toDTO(row: AdminTransactionListItem): AdminTransactionDTO {
    const dto: AdminTransactionDTO = {
      id: row._id,
      amount: row.amount,
      action: row.action,
      reason: row.reason,
      status: row.status,
      createdAt: row.createdAt,
      displayName: row.displayName ?? null,
      relatedProjectName: row.relatedProjectName ?? null,
      relatedEntityType: row.relatedEntityType ?? "SYSTEM",
    };

    if (row.fromWalletId) {
      dto.fromWalletId = row.fromWalletId;
    }

    if (row.toWalletId) {
      dto.toWalletId = row.toWalletId;
    }

    if (row.relatedDealId) {
      dto.relatedDealId = row.relatedDealId;
    }

    return dto;
  }
}

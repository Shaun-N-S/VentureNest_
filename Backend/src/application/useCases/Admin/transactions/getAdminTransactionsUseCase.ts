import { ITransactionRepository } from "@domain/interfaces/repositories/ITransactionRepository";
import {
  GetAdminTransactionsRequestDTO,
  AdminTransactionDTO,
} from "application/dto/admin/adminTransactionDTO";
import { IGetAdminTransactionsUseCase } from "@domain/interfaces/useCases/admin/transaction/IGetAdminTransactionsUseCase";
import { AdminTransactionMapper } from "application/mappers/adminTransactionMapper";

type AdminTransactionFilters = {
  reason?: string;
  action?: string;
  status?: string;
  relatedDealId?: string;
};

export class GetAdminTransactionsUseCase implements IGetAdminTransactionsUseCase {
  constructor(private readonly transactionRepository: ITransactionRepository) {}

  async execute(request: GetAdminTransactionsRequestDTO): Promise<{
    transactions: AdminTransactionDTO[];
    totalTransactions: number;
    totalPages: number;
    currentPage: number;
  }> {
    const { reason, action, status, dealId, page, limit } = request;

    const filters: AdminTransactionFilters = {};

    if (reason) filters.reason = reason;
    if (action) filters.action = action;
    if (status) filters.status = status;
    if (dealId) filters.relatedDealId = dealId;

    const skip = (page - 1) * limit;

    const transactions = await this.transactionRepository.findAdminTransactions(
      filters,
      skip,
      limit
    );

    const total = await this.transactionRepository.countAdminTransactions(filters);

    const totalPages = Math.ceil(total / limit);

    return {
      transactions: transactions.map((tx) => AdminTransactionMapper.toDTO(tx)),
      totalTransactions: total,
      totalPages,
      currentPage: page,
    };
  }
}

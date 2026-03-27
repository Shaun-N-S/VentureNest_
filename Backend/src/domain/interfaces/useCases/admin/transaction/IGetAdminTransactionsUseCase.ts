import {
  GetAdminTransactionsRequestDTO,
  AdminTransactionDTO,
} from "application/dto/admin/adminTransactionDTO";

export interface IGetAdminTransactionsUseCase {
  execute(request: GetAdminTransactionsRequestDTO): Promise<{
    transactions: AdminTransactionDTO[];
    totalTransactions: number;
    totalPages: number;
    currentPage: number;
  }>;
}

import {
  GetAdminTransactionsRequestDTO,
  AdminTransactionDTO,
} from "application/dto/admin/adminTransactionDTO";

export interface IGetAdminTransactionsUseCase {
  execute(
    request: GetAdminTransactionsRequestDTO
  ): Promise<{ data: AdminTransactionDTO[]; total: number }>;
}

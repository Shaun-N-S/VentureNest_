import {
  GetWalletTransactionsRequestDTO,
  TransactionDTO,
} from "application/dto/transaction/transactionDTO";

export interface IGetWalletTransactionsUseCase {
  execute(request: GetWalletTransactionsRequestDTO): Promise<TransactionDTO[]>;
}

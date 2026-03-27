import {
  GetWalletTransactionsRequestDTO,
  GetWalletTransactionsResponseDTO,
} from "application/dto/transaction/transactionDTO";

export interface IGetWalletTransactionsUseCase {
  execute(request: GetWalletTransactionsRequestDTO): Promise<GetWalletTransactionsResponseDTO>;
}

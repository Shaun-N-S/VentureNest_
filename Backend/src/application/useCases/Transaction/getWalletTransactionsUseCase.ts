import { IWalletRepository } from "@domain/interfaces/repositories/IWalletRepository";
import { ITransactionRepository } from "@domain/interfaces/repositories/ITransactionRepository";
import { WalletOwnerType } from "@domain/enum/walletOwnerType";
import { TransactionMapper } from "application/mappers/transactionMapper";
import { IGetWalletTransactionsUseCase } from "@domain/interfaces/useCases/transaction/IGetWalletTransactionsUseCase";
import {
  GetWalletTransactionsRequestDTO,
  TransactionDTO,
} from "application/dto/transaction/transactionDTO";
import { UserRole } from "@domain/enum/userRole";

export class GetWalletTransactionsUseCase implements IGetWalletTransactionsUseCase {
  constructor(
    private readonly walletRepository: IWalletRepository,
    private readonly transactionRepository: ITransactionRepository
  ) {}

  async execute(request: GetWalletTransactionsRequestDTO): Promise<TransactionDTO[]> {
    const walletOwnerType =
      request.ownerRole === UserRole.INVESTOR ? WalletOwnerType.INVESTOR : WalletOwnerType.USER;

    const wallet = await this.walletRepository.findByOwner(walletOwnerType, request.ownerId);

    if (!wallet) {
      return [];
    }

    const transactions = await this.transactionRepository.findByWallet(wallet._id!, request.action);

    return transactions.map((transaction) => TransactionMapper.toDTO(transaction));
  }
}

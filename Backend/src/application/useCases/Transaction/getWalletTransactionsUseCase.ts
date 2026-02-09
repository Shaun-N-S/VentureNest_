import { IWalletRepository } from "@domain/interfaces/repositories/IWalletRepository";
import { ITransactionRepository } from "@domain/interfaces/repositories/ITransactionRepository";
import { WalletOwnerType } from "@domain/enum/walletOwnerType";
import { TransactionMapper } from "application/mappers/transactionMapper";
import { TransactionAction } from "@domain/enum/transactionType";
import { UserRole } from "@domain/enum/userRole";
import { IGetWalletTransactionsUseCase } from "@domain/interfaces/useCases/transaction/IGetWalletTransactionsUseCase";

export class GetWalletTransactionsUseCase implements IGetWalletTransactionsUseCase {
  constructor(
    private _walletRepo: IWalletRepository,
    private _transactionRepo: ITransactionRepository
  ) {}

  async execute(params: { ownerId: string; ownerType: UserRole; action?: TransactionAction }) {
    const wallet = await this._walletRepo.findByOwner(
      params.ownerType === UserRole.INVESTOR ? WalletOwnerType.INVESTOR : WalletOwnerType.USER,
      params.ownerId
    );

    if (!wallet) return [];

    const transactions = await this._transactionRepo.findByWallet(wallet._id!, params.action);

    return transactions.map(TransactionMapper.toDTO);
  }
}

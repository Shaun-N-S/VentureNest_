import { IWalletRepository } from "@domain/interfaces/repositories/IWalletRepository";
import { ITransactionRepository } from "@domain/interfaces/repositories/ITransactionRepository";
import { WalletOwnerType } from "@domain/enum/walletOwnerType";
import { TransactionMapper } from "application/mappers/transactionMapper";
import { IGetWalletTransactionsUseCase } from "@domain/interfaces/useCases/transaction/IGetWalletTransactionsUseCase";
import {
  GetWalletTransactionsRequestDTO,
  GetWalletTransactionsResponseDTO,
} from "application/dto/transaction/transactionDTO";
import { UserRole } from "@domain/enum/userRole";

export class GetWalletTransactionsUseCase implements IGetWalletTransactionsUseCase {
  constructor(
    private readonly walletRepository: IWalletRepository,
    private readonly transactionRepository: ITransactionRepository
  ) {}

  async execute(
    request: GetWalletTransactionsRequestDTO
  ): Promise<GetWalletTransactionsResponseDTO> {
    const { ownerId, ownerRole, action, page, limit } = request;

    const walletOwnerType =
      ownerRole === UserRole.INVESTOR ? WalletOwnerType.INVESTOR : WalletOwnerType.USER;

    const wallet = await this.walletRepository.findByOwner(walletOwnerType, ownerId);

    if (!wallet) {
      return {
        data: [],
        total: 0,
        page,
        limit,
      };
    }

    const skip = (page - 1) * limit;

    const transactions = await this.transactionRepository.findByWalletPaginated(
      wallet._id!,
      action,
      skip,
      limit
    );

    const total = await this.transactionRepository.countByWallet(wallet._id!, action);

    return {
      data: transactions.map(TransactionMapper.toDTO),
      total,
      page,
      limit,
    };
  }
}

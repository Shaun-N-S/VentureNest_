import { TransactionDTO } from "application/dto/transaction/transactionDTO";
import { TransactionAction } from "@domain/enum/transactionType";
import { UserRole } from "@domain/enum/userRole";

export interface IGetWalletTransactionsUseCase {
  execute(params: {
    ownerId: string;
    ownerType: UserRole;
    action?: TransactionAction;
  }): Promise<TransactionDTO[]>;
}

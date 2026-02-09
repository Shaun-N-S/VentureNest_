import { UserRole } from "@domain/enum/userRole";

export interface ICreateWalletTopupCheckoutUseCase {
  execute(ownerId: string, ownerRole: UserRole, amount: number): Promise<string>;
}

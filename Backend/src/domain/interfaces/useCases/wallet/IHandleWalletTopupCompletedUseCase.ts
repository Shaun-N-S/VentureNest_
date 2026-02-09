import { UserRole } from "@domain/enum/userRole";

export interface IHandleWalletTopupCompletedUseCase {
  execute(data: {
    sessionId: string;
    ownerId: string;
    ownerRole: UserRole;
    amount: number;
  }): Promise<void>;
}

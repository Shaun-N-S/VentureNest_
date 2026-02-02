import { UserRole } from "@domain/enum/userRole";

export interface IHandleCheckoutCompletedUseCase {
  execute(data: {
    sessionId: string;
    ownerId: string;
    ownerRole: UserRole;
    planId: string;
    durationDays: number;
  }): Promise<void>;
}

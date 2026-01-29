import { UserRole } from "@domain/enum/userRole";

export interface IPaymentService {
  createCheckoutSession(data: {
    ownerId: string;
    ownerRole: UserRole;
    planId: string;
    planName: string;
    description: string;
    amount: number;
    durationDays: number;
  }): Promise<string>;
}

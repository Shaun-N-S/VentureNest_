import { UserRole } from "@domain/enum/userRole";

export interface PaymentEntity {
  id?: string;

  sessionId: string;

  ownerId: string;
  ownerRole: UserRole;

  planId: string;
  amount: number;

  createdAt?: Date;
}

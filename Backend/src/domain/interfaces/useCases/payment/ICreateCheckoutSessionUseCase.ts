import { UserRole } from "@domain/enum/userRole";

export interface ICreateCheckoutSessionUseCase {
  execute(ownerId: string, ownerRole: UserRole, planId: string): Promise<string>;
}

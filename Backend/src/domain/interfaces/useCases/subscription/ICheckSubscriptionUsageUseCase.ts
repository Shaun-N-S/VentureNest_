import { SubscriptionAction } from "@domain/enum/subscriptionActions";
import { UserRole } from "@domain/enum/userRole";

export interface IIncrementSubscriptionUsageUseCase {
  execute(ownerId: string, ownerRole: UserRole, action: SubscriptionAction): Promise<void>;
}

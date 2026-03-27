import { SubscriptionAction } from "@domain/enum/subscriptionActions";
import { UserRole } from "@domain/enum/userRole";

export interface ICheckSubscriptionAccessUseCase {
  execute(data: {
    ownerId: string;
    ownerRole: UserRole;
    action: SubscriptionAction;
  }): Promise<void>;
}

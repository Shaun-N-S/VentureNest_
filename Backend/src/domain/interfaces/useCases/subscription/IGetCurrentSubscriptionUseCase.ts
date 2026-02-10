import { UserRole } from "@domain/enum/userRole";
import { CurrentSubscriptionDTO } from "application/dto/subscription/currentSubscriptionDTO";

export interface IGetCurrentSubscriptionUseCase {
  execute(ownerId: string, ownerRole: UserRole): Promise<CurrentSubscriptionDTO | null>;
}

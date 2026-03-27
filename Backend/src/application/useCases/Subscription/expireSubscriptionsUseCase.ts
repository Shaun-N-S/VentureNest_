import { ISubscriptionRepository } from "@domain/interfaces/repositories/ISubscriptionRepository";
import { IExpireSubscriptionsUseCase } from "@domain/interfaces/useCases/subscription/IExpireSubscriptionsUseCase";

export class ExpireSubscriptionsUseCase implements IExpireSubscriptionsUseCase {
  constructor(private _subscriptionRepo: ISubscriptionRepository) {}

  async execute(): Promise<void> {
    await this._subscriptionRepo.expireAllExpired();
  }
}

import { SubscriptionModel } from "@infrastructure/db/models/subscriptionModel";
import { SubscriptionRepository } from "@infrastructure/repostiories/subscriptionRepository";
import { IncrementSubscriptionUsageUseCase } from "application/useCases/Subscription/incrementSubscriptionUsageUseCase";

class SubscriptionUsageContainer {
  private _subscriptionRepo = new SubscriptionRepository(SubscriptionModel);

  public incrementUsageUC = new IncrementSubscriptionUsageUseCase(this._subscriptionRepo);
}

export const subscriptionUsageContainer = new SubscriptionUsageContainer();

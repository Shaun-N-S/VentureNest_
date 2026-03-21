import { SubscriptionModel } from "@infrastructure/db/models/subscriptionModel";
import { SubscriptionRepository } from "@infrastructure/repostiories/subscriptionRepository";

import { ExpireSubscriptionsUseCase } from "application/useCases/Subscription/expireSubscriptionsUseCase";
import { SubscriptionExpiryCron } from "@infrastructure/cron/subscriptionExpiryCron";

class SubscriptionCronContainer {
  private _subscriptionRepo = new SubscriptionRepository(SubscriptionModel);

  private _expireUC = new ExpireSubscriptionsUseCase(this._subscriptionRepo);

  private _cron = new SubscriptionExpiryCron(this._expireUC);

  start() {
    this._cron.start();
  }
}

export const subscriptionCronContainer = new SubscriptionCronContainer();

import cron from "node-cron";
import { IExpireSubscriptionsUseCase } from "@domain/interfaces/useCases/subscription/IExpireSubscriptionsUseCase";

export class SubscriptionExpiryCron {
  constructor(private _expireSubscriptionsUC: IExpireSubscriptionsUseCase) {}

  start() {
    cron.schedule("0 0 * * *", async () => {
      console.log("⏳ Running subscription expiry cron...");

      try {
        await this._expireSubscriptionsUC.execute();
        console.log("✅ Expired subscriptions updated");
      } catch (error) {
        console.error("❌ Cron error:", error);
      }
    });
  }
}

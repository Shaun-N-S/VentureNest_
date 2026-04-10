import { investmentOfferCronContainer } from "../Investor/investmentOfferCronContainer";
import { subscriptionCronContainer } from "../Subscription/subscriptionCronContainer";

class CronContainer {
  startAll() {
    subscriptionCronContainer.start();
    investmentOfferCronContainer.start();
  }
}

export const cronContainer = new CronContainer();

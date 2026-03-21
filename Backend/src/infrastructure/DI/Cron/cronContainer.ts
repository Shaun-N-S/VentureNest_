import { subscriptionCronContainer } from "../Subscription/subscriptionCronContainer";

class CronContainer {
  startAll() {
    subscriptionCronContainer.start();
  }
}

export const cronContainer = new CronContainer();

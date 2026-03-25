import { Stripe } from "stripe";

export interface IStripeConnectService {
  createAccount(email: string): Promise<{ accountId: string }>;

  createOnboardingLink(accountId: string): Promise<{ url: string }>;

  createPayout(
    accountId: string,
    amount: number,
    metadata: Record<string, string>
  ): Promise<{ transferId: string }>;

  constructWebhookEvent(payload: Buffer, signature: string): Stripe.Event;
}

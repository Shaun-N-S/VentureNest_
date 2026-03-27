import { CONFIG } from "@config/config";
import { stripe } from "./stripeClient";
import { IStripeConnectService } from "@domain/interfaces/services/IStripeConnectService";
import { Stripe } from "stripe";

export class StripeConnectService implements IStripeConnectService {
  async createAccount(email: string): Promise<{ accountId: string }> {
    const account = await stripe.accounts.create({
      type: "express",
      email,
    });

    return { accountId: account.id };
  }

  async createOnboardingLink(accountId: string): Promise<{ url: string }> {
    const link = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: "http://localhost:3000/reauth",
      return_url: "http://localhost:3000/success",
      type: "account_onboarding",
    });

    return { url: link.url };
  }

  async createPayout(
    accountId: string,
    amount: number,
    metadata: Record<string, string>
  ): Promise<{ transferId: string }> {
    const transfer = await stripe.transfers.create({
      amount: amount * 100,
      currency: "inr",
      destination: accountId,
      metadata,
    });

    return { transferId: transfer.id };
  }

  constructWebhookEvent(payload: Buffer, signature: string): Stripe.Event {
    return stripe.webhooks.constructEvent(payload, signature, CONFIG.STRIPE_WEBHOOK_SECRET!);
  }
}

import { CONFIG } from "@config/config";
import { stripe } from "@infrastructure/services/Stripe/stripeClient";
import { Request, Response } from "express";
import Stripe from "stripe";
import { Errors } from "@shared/constants/error";
import { UserRole } from "@domain/enum/userRole";
import { PaymentPurpose } from "@domain/enum/paymentPurpose";
import { IHandleCheckoutCompletedUseCase } from "@domain/interfaces/useCases/payment/IHandleCheckoutCompletedUseCase";
import { IHandleWalletTopupCompletedUseCase } from "@domain/interfaces/useCases/wallet/IHandleWalletTopupCompletedUseCase";
import { IHandleDealInstallmentStripeCompletedUseCase } from "@domain/interfaces/useCases/deal/IHandleDealInstallmentStripeCompletedUseCase";

export class WebhookController {
  constructor(
    private _handleCheckoutCompletedUC: IHandleCheckoutCompletedUseCase,
    private _handleWalletTopupCompletedUC: IHandleWalletTopupCompletedUseCase,
    private _handleDealInstallmentCompletedUC: IHandleDealInstallmentStripeCompletedUseCase
  ) {}

  handleStripeWebhook = async (req: Request, res: Response): Promise<void> => {
    const sig = req.headers["stripe-signature"] as string;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, CONFIG.STRIPE_WEBHOOK_SECRET!);
    } catch {
      res.status(400).json({ error: Errors.INVALID_STRIPE_WEBHOOK_SIGNATURE });
      return;
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log(session);

      const role = session.metadata?.role as UserRole | undefined;
      const purpose = session.metadata?.purpose as PaymentPurpose | undefined;

      const ownerId = session.metadata?.ownerId;
      if (!ownerId) {
        res.status(400).json({ error: "OwnerId missing in Stripe metadata" });
        return;
      }

      if (!role || !purpose) {
        res.status(400).json({ error: "Invalid Stripe metadata" });
        return;
      }

      if (purpose === PaymentPurpose.SUBSCRIPTION) {
        await this._handleCheckoutCompletedUC.execute({
          sessionId: session.id,
          ownerId,
          ownerRole: role,
          planId: session.metadata!.planId!,
          durationDays: Number(session.metadata!.durationDays),
        });
      }

      if (purpose === PaymentPurpose.WALLET_TOPUP) {
        await this._handleWalletTopupCompletedUC.execute({
          sessionId: session.id,
          ownerId,
          ownerRole: role,
          amount: session.amount_total! / 100,
        });
      }

      if (purpose === PaymentPurpose.DEAL_INSTALLMENT) {
        await this._handleDealInstallmentCompletedUC.execute({
          sessionId: session.id,
          ownerId,
          ownerRole: role,
          dealId: session.metadata!.dealId!,
          amount: Number(session.metadata!.installmentAmount),
        });
      }
    }

    res.json({ received: true });
  };
}

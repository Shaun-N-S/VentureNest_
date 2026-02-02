import { CONFIG } from "@config/config";
import { stripe } from "@infrastructure/services/Stripe/stripeClient";
import { Request, Response } from "express";
import Stripe from "stripe";
import { Errors } from "@shared/constants/error";
import { UserRole } from "@domain/enum/userRole";
import { IHandleCheckoutCompletedUseCase } from "@domain/interfaces/useCases/payment/IHandleCheckoutCompletedUseCase";

export class WebhookController {
  constructor(private handleCheckoutCompletedUC: IHandleCheckoutCompletedUseCase) {}

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

      const role = session.metadata?.role;

      if (!role || !Object.values(UserRole).includes(role as UserRole)) {
        res.status(400).json({ error: "Invalid role in Stripe metadata" });
        return;
      }

      await this.handleCheckoutCompletedUC.execute({
        sessionId: session.id,
        ownerId: session.metadata?.ownerId!,
        ownerRole: role as UserRole,
        planId: session.metadata?.planId!,
        durationDays: Number(session.metadata?.durationDays),
      });
    }

    res.json({ received: true });
  };
}

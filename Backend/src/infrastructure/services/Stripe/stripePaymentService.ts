import { CONFIG } from "@config/config";
import { stripe } from "./stripeClient";
import { IPaymentService } from "@domain/interfaces/services/IPaymentService";
import { UserRole } from "@domain/enum/userRole";
import { PaymentPurpose } from "@domain/enum/paymentPurpose";

export class StripePaymentService implements IPaymentService {
  async createCheckoutSession(data: {
    ownerId: string;
    ownerRole: UserRole;
    planId?: string;
    planName: string;
    description: string;
    amount: number;
    durationDays?: number;
    purpose: PaymentPurpose;
  }): Promise<string> {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: data.planName,
              description: data.description,
            },
            unit_amount: data.amount * 100,
          },
          quantity: 1,
        },
      ],
      metadata: {
        purpose: data.purpose,
        ownerId: data.ownerId,
        role: data.ownerRole,
        ...(data.purpose === PaymentPurpose.SUBSCRIPTION && {
          planId: data.planId!,
          durationDays: String(data.durationDays!),
        }),
      },
      success_url: `${CONFIG.FRONTEND_URL}/payment-success`,
      cancel_url: `${CONFIG.FRONTEND_URL}/payment-cancel`,
    });

    return session.url!;
  }
}

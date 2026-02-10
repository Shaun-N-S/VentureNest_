import { IPaymentService } from "@domain/interfaces/services/IPaymentService";
import { UserRole } from "@domain/enum/userRole";
import { PaymentPurpose } from "@domain/enum/paymentPurpose";

export class CreateWalletTopupCheckoutUseCase {
  constructor(private _paymentService: IPaymentService) {}

  async execute(ownerId: string, ownerRole: UserRole, amount: number): Promise<string> {
    return this._paymentService.createCheckoutSession({
      ownerId,
      ownerRole,
      planName: "Wallet Top-Up",
      description: "Add money to wallet",
      amount,
      purpose: PaymentPurpose.WALLET_TOPUP,
    });
  }
}

import { IPaymentService } from "@domain/interfaces/services/IPaymentService";
import { UserRole } from "@domain/enum/userRole";
import { PaymentPurpose } from "@domain/enum/paymentPurpose";
import { InvalidDataException } from "application/constants/exceptions";
import { WALLET_ERRORS } from "@shared/constants/error";

export class CreateWalletTopupCheckoutUseCase {
  constructor(private _paymentService: IPaymentService) {}

  async execute(ownerId: string, ownerRole: UserRole, amount: number): Promise<string> {
    if (amount <= 0) {
      throw new InvalidDataException(WALLET_ERRORS.INVALID_TOPUP_AMOUNT);
    }

    return await this._paymentService.createCheckoutSession({
      ownerId,
      ownerRole,
      amount,
      purpose: PaymentPurpose.WALLET_TOPUP,
      planName: "Wallet Top-Up",
      description: "Add money to wallet",
      metadata: {},
    });
  }
}

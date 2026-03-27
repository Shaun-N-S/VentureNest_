import { ICreateDealInstallmentCheckoutUseCase } from "@domain/interfaces/useCases/deal/ICreateDealInstallmentCheckoutUseCase";
import { IDealRepository } from "@domain/interfaces/repositories/IDealRepository";
import { IPaymentService } from "@domain/interfaces/services/IPaymentService";
import { DealStatus } from "@domain/enum/dealStatus";
import { PaymentPurpose } from "@domain/enum/paymentPurpose";
import {
  ForbiddenException,
  InvalidDataException,
  NotFoundExecption,
} from "application/constants/exceptions";
import { DEAL_ERRORS } from "@shared/constants/error";
import { CreateDealInstallmentCheckoutDTO } from "application/dto/deal/createDealInstallmentCheckoutDTO";
import { UserRole } from "@domain/enum/userRole";

export class CreateDealInstallmentCheckoutUseCase implements ICreateDealInstallmentCheckoutUseCase {
  constructor(
    private _dealRepo: IDealRepository,
    private _paymentService: IPaymentService
  ) {}

  async execute(investorId: string, dto: CreateDealInstallmentCheckoutDTO): Promise<string> {
    const deal = await this._dealRepo.findById(dto.dealId);

    if (!deal) {
      throw new NotFoundExecption(DEAL_ERRORS.DEAL_NOT_FOUND);
    }

    if (deal.investorId !== investorId) {
      throw new ForbiddenException(DEAL_ERRORS.UNAUTHORIZED_DEAL_ACCESS);
    }

    if (deal.status === DealStatus.COMPLETED) {
      throw new InvalidDataException(DEAL_ERRORS.DEAL_ALREADY_COMPLETED);
    }

    if (dto.amount <= 0 || dto.amount > deal.remainingAmount) {
      throw new InvalidDataException(DEAL_ERRORS.INVALID_INSTALLMENT_AMOUNT);
    }

    return await this._paymentService.createCheckoutSession({
      ownerId: investorId,
      ownerRole: UserRole.INVESTOR,
      amount: dto.amount,
      purpose: PaymentPurpose.DEAL_INSTALLMENT,
      planName: "Deal Installment Payment",
      description: `Installment for deal ${dto.dealId}`,
      metadata: {
        dealId: dto.dealId,
        installmentAmount: dto.amount.toString(),
      },
    });
  }
}

import { IPaymentRepository } from "@domain/interfaces/repositories/IPaymentRepository";
import { IDealRepository } from "@domain/interfaces/repositories/IDealRepository";
import { IProjectRepository } from "@domain/interfaces/repositories/IProjectRepository";
import {
  IGetPaymentSessionSummaryUseCase,
  PaymentSessionSummaryDTO,
} from "@domain/interfaces/useCases/payment/IGetPaymentSessionSummaryUseCase";
import { PaymentPurpose } from "@domain/enum/paymentPurpose";

export class GetPaymentSessionSummaryUseCase implements IGetPaymentSessionSummaryUseCase {
  constructor(
    private _paymentRepo: IPaymentRepository,
    private _dealRepo: IDealRepository,
    private _projectRepo: IProjectRepository
  ) {}

  async execute(sessionId: string): Promise<PaymentSessionSummaryDTO> {
    const payment = await this._paymentRepo.findBySessionId(sessionId);

    if (!payment) {
      return { found: false, sessionId };
    }

    const summary: PaymentSessionSummaryDTO = {
      found: true,
      sessionId,
      purpose: payment.purpose,
      amount: payment.amount,
      createdAt: payment.createdAt,
      dealId: payment.dealId,
      planId: payment.planId,
    };

    if (payment.purpose === PaymentPurpose.DEAL_INSTALLMENT && payment.dealId) {
      const deal = await this._dealRepo.findById(payment.dealId);
      if (deal) {
        const project = await this._projectRepo.findById(deal.projectId);
        summary.startupName = project?.startupName;
      }
    }

    return summary;
  }
}

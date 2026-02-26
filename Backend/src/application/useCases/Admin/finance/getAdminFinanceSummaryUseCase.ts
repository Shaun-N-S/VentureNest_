import { IGetAdminFinanceSummaryUseCase } from "@domain/interfaces/useCases/admin/finance/IGetAdminFinanceSummaryUseCase";
import { ITransactionRepository } from "@domain/interfaces/repositories/ITransactionRepository";
import { IDealRepository } from "@domain/interfaces/repositories/IDealRepository";
import { IPaymentRepository } from "@domain/interfaces/repositories/IPaymentRepository";
import { AdminFinanceSummaryDTO } from "application/dto/admin/adminFinanceSummaryDTO";
import { TransactionReason } from "@domain/enum/transactionType";
import { DealStatus } from "@domain/enum/dealStatus";
import { PaymentPurpose } from "@domain/enum/paymentPurpose";

export class GetAdminFinanceSummaryUseCase implements IGetAdminFinanceSummaryUseCase {
  constructor(
    private _transactionRepository: ITransactionRepository,
    private _dealRepository: IDealRepository,
    private _paymentRepository: IPaymentRepository
  ) {}

  async execute(): Promise<AdminFinanceSummaryDTO> {
    const totalInvestmentAmount = await this._transactionRepository.sumByReason(
      TransactionReason.INVESTMENT
    );

    const totalPlatformFeesCollected = await this._transactionRepository.sumByReason(
      TransactionReason.PLATFORM_FEE
    );

    const totalWalletTopups = await this._transactionRepository.sumByReason(
      TransactionReason.WALLET_TOPUP
    );

    const totalSubscriptionsRevenue = await this._paymentRepository.sumByPurpose(
      PaymentPurpose.SUBSCRIPTION
    );

    const totalDealsCompleted = await this._dealRepository.countByStatus(DealStatus.COMPLETED);

    const totalDealsPartiallyPaid = await this._dealRepository.countByStatus(
      DealStatus.PARTIALLY_PAID
    );

    return {
      totalInvestmentAmount,
      totalPlatformFeesCollected,
      totalWalletTopups,
      totalSubscriptionsRevenue,
      totalDealsCompleted,
      totalDealsPartiallyPaid,
    };
  }
}

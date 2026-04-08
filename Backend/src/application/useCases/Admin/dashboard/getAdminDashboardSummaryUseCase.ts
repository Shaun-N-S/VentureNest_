import { IGetAdminDashboardSummaryUseCase } from "@domain/interfaces/useCases/admin/dashboard/IGetAdminDashboardSummaryUseCase";
import { IUserRepository } from "@domain/interfaces/repositories/IUserRepository";
import { IInvestorRepository } from "@domain/interfaces/repositories/IInvestorRespository";
import { IProjectRepository } from "@domain/interfaces/repositories/IProjectRepository";
import { ITransactionRepository } from "@domain/interfaces/repositories/ITransactionRepository";
import { IDealRepository } from "@domain/interfaces/repositories/IDealRepository";
import { IPaymentRepository } from "@domain/interfaces/repositories/IPaymentRepository";
import { TransactionReason } from "@domain/enum/transactionType";
import { DealStatus } from "@domain/enum/dealStatus";
import { PaymentPurpose } from "@domain/enum/paymentPurpose";
import { AdminDashboardSummaryDTO } from "application/dto/admin/adminDashboardSummaryDTO";

export class GetAdminDashboardSummaryUseCase implements IGetAdminDashboardSummaryUseCase {
  constructor(
    private _userRepo: IUserRepository,
    private _investorRepo: IInvestorRepository,
    private _projectRepo: IProjectRepository,
    private _transactionRepo: ITransactionRepository,
    private _dealRepo: IDealRepository,
    private _paymentRepo: IPaymentRepository
  ) {}

  async execute(): Promise<AdminDashboardSummaryDTO> {
    const [
      totalUsers,
      totalInvestors,
      totalProjects,
      subscriptionRevenue,
      commissionRevenue,
      totalDealsCompleted,
      totalDealsPartiallyPaid,
    ] = await Promise.all([
      this._userRepo.count(),
      this._investorRepo.count(),
      this._projectRepo.countAdmin(),
      this._paymentRepo.sumByPurpose(PaymentPurpose.SUBSCRIPTION),
      this._transactionRepo.sumByReason(TransactionReason.PLATFORM_FEE),
      this._dealRepo.countByStatus(DealStatus.COMPLETED),
      this._dealRepo.countByStatus(DealStatus.PARTIALLY_PAID),
    ]);

    const totalRevenue = subscriptionRevenue + commissionRevenue;

    return {
      totalUsers,
      totalInvestors,
      totalProjects,

      totalRevenue,
      subscriptionRevenue,
      commissionRevenue,

      totalDealsCompleted,
      totalDealsPartiallyPaid,
    };
  }
}

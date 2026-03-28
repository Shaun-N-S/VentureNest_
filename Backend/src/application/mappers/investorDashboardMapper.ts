import { InvestorDashboardSummaryDTO } from "application/dto/dashboard/investorDashboardSummaryDTO";
import { DealEntity } from "@domain/entities/deal/dealEntity";
import { WalletEntity } from "@domain/entities/wallet/walletEntity";
import { DealStatus } from "@domain/enum/dealStatus";

export class InvestorDashboardMapper {
  static toDTO(deals: DealEntity[], wallet: WalletEntity | null): InvestorDashboardSummaryDTO {
    const totalInvested = deals.reduce((sum, d) => sum + (d.amountPaid || 0), 0);

    const activeInvestments = deals.filter((d) => d.status !== DealStatus.COMPLETED).length;

    return {
      totalInvested,
      activeInvestments,
      walletBalance: wallet?.balance || 0,
      lockedBalance: wallet?.lockedBalance || 0,
    };
  }
}

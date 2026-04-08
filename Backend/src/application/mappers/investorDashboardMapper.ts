import { InvestorDashboardSummaryDTO } from "application/dto/dashboard/investorDashboardSummaryDTO";
import { DealEntity } from "@domain/entities/deal/dealEntity";
import { WalletEntity } from "@domain/entities/wallet/walletEntity";
import { DealStatus } from "@domain/enum/dealStatus";
import {
  InvestmentChartData,
  InvestmentChartDTO,
} from "application/dto/dashboard/investmentChartDTO";
import { InvestorPortfolioData } from "application/dto/dashboard/investorPortfolioDTO";

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

  static toPortfolioDTO(data: InvestorPortfolioData): InvestorPortfolioData {
    return data.map((item) => ({
      projectId: item.projectId,
      startupName: item.startupName,
      investedAmount: item.investedAmount,
      equity: item.equity,
      stage: item.stage,
      status: item.status,
      ...(item.logo && { logo: item.logo }),
    }));
  }

  static toInvestmentChartDTO(data: InvestmentChartData[]): InvestmentChartDTO {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return data.map((item) => ({
      month: months[item.month - 1] ?? "Unknown",
      year: item.year,
      totalInvested: item.totalInvested,
    }));
  }
}

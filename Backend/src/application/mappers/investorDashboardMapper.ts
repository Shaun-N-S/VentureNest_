import { InvestorDashboardSummaryDTO } from "application/dto/dashboard/investorDashboardSummaryDTO";
import { DealEntity } from "@domain/entities/deal/dealEntity";
import { WalletEntity } from "@domain/entities/wallet/walletEntity";
import { DealStatus } from "@domain/enum/dealStatus";
import {
  InvestmentChartData,
  InvestmentChartDTO,
} from "application/dto/dashboard/investmentChartDTO";
import { InvestorPortfolioData } from "application/dto/dashboard/investorPortfolioDTO";
import { ProjectEntity } from "@domain/entities/project/projectEntity";
import { InvestorDistributionDTO } from "application/dto/dashboard/investorDistributionDTO";

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

  static toDistributionDTO(
    projectInvestments: { projectId: string; totalInvested: number }[],
    projects: ProjectEntity[]
  ): InvestorDistributionDTO {
    const investmentDistribution = projectInvestments.map((item) => {
      const project = projects.find((p) => p._id === item.projectId);

      return {
        name: project?.startupName || "Unknown",
        value: item.totalInvested,
      };
    });

    const stageMap: Record<string, number> = {};

    projectInvestments.forEach((item) => {
      const project = projects.find((p) => p._id === item.projectId);
      if (!project) return;

      const stage = project.stage || "Unknown";

      stageMap[stage] = (stageMap[stage] || 0) + item.totalInvested;
    });

    const stageDistribution = Object.entries(stageMap).map(([name, value]) => ({
      name,
      value,
    }));

    return {
      investmentDistribution,
      stageDistribution,
    };
  }
}

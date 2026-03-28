import { capTableModel } from "@infrastructure/db/models/capTableModel";
import { dealModel } from "@infrastructure/db/models/dealModel";
import { projectModel } from "@infrastructure/db/models/projectModel";
import { projectMonthlyReportModel } from "@infrastructure/db/models/projectMonthlyReportModel";
import { walletModel } from "@infrastructure/db/models/walletModel";
import { CapTableRepository } from "@infrastructure/repostiories/capTableRepository";
import { DealRepository } from "@infrastructure/repostiories/dealRepository";
import { ProjectMonthlyReportRepository } from "@infrastructure/repostiories/projectMontlyReportRepository";
import { ProjectRepository } from "@infrastructure/repostiories/projectRepository";
import { WalletRepository } from "@infrastructure/repostiories/walletRepository";
// import { GetInvestmentChartUseCase } from "application/useCases/Dashboard/getInvestmentChartUseCase";
import { GetInvestorDashboardSummaryUseCase } from "application/useCases/Dashboard/getInvestorDashboardSummaryUseCase";
import { GetInvestorPortfolioUseCase } from "application/useCases/Dashboard/getInvestorPortfolioUseCase";
import { GetProjectReportAnalyticsUseCase } from "application/useCases/Dashboard/getProjectReportAnalyticsUseCase";
import { GetUserDashboardUseCase } from "application/useCases/Dashboard/getUserDashboardUseCase";
import { DashboardController } from "interfaceAdapters/controller/Dashboard/dashboardController";

const projectRepo = new ProjectRepository(projectModel);
const dealRepo = new DealRepository(dealModel);
const capTableRepo = new CapTableRepository(capTableModel);
const reportRepo = new ProjectMonthlyReportRepository(projectMonthlyReportModel);
const walletRepo = new WalletRepository(walletModel);

const getUserDashboardUseCase = new GetUserDashboardUseCase(
  projectRepo,
  dealRepo,
  capTableRepo,
  reportRepo
);
const getProjectAnalyticsUseCase = new GetProjectReportAnalyticsUseCase(reportRepo);
const getInvestorDashboardSummaryUseCase = new GetInvestorDashboardSummaryUseCase(
  dealRepo,
  walletRepo
);
const getInvestorPortfolioUseCase = new GetInvestorPortfolioUseCase(dealRepo);
// const getInvestmentChartUseCase = new GetInvestmentChartUseCase(dealRepo);

export const dashboardController = new DashboardController(
  getUserDashboardUseCase,
  getProjectAnalyticsUseCase,
  getInvestorDashboardSummaryUseCase,
  getInvestorPortfolioUseCase
  // getInvestmentChartUseCase
);

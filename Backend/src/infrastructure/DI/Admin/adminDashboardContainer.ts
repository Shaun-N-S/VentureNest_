import { dealModel } from "@infrastructure/db/models/dealModel";
import { investorModel } from "@infrastructure/db/models/investorModel";
import { PaymentModel } from "@infrastructure/db/models/paymentModel";
import { projectModel } from "@infrastructure/db/models/projectModel";
import { transactionModel } from "@infrastructure/db/models/transactionModel";
import { userModel } from "@infrastructure/db/models/userModel";
import { DealRepository } from "@infrastructure/repostiories/dealRepository";
import { InvestorRepository } from "@infrastructure/repostiories/investorRepository";
import { PaymentRepository } from "@infrastructure/repostiories/paymentRepository";
import { ProjectRepository } from "@infrastructure/repostiories/projectRepository";
import { TransactionRepository } from "@infrastructure/repostiories/transactionRepository";
import { UserRepository } from "@infrastructure/repostiories/userRepository";
import { StorageService } from "@infrastructure/services/storageService";
import { GetAdminDashboardGraphUseCase } from "application/useCases/Admin/dashboard/getAdminDashboardGraphUseCase";
import { GetAdminDashboardSummaryUseCase } from "application/useCases/Admin/dashboard/getAdminDashboardSummaryUseCase";
import { GetAdminDashboardTopUseCase } from "application/useCases/Admin/dashboard/getAdminDashboardTopUseCase";
import { AdminDashboardController } from "interfaceAdapters/controller/Admin/adminDashboardController";

const userRepo = new UserRepository(userModel);
const investorRepo = new InvestorRepository(investorModel);
const projectRepo = new ProjectRepository(projectModel);
const transactionRepo = new TransactionRepository(transactionModel);
const dealRepo = new DealRepository(dealModel);
const paymentRepo = new PaymentRepository(PaymentModel);
const storageService = new StorageService();

const getSummaryUseCase = new GetAdminDashboardSummaryUseCase(
  userRepo,
  investorRepo,
  projectRepo,
  transactionRepo,
  dealRepo,
  paymentRepo
);
const getGraphUseCase = new GetAdminDashboardGraphUseCase(transactionRepo);
const getTopUseCase = new GetAdminDashboardTopUseCase(
  dealRepo,
  projectRepo,
  investorRepo,
  storageService
);

export const adminDashboardController = new AdminDashboardController(
  getSummaryUseCase,
  getGraphUseCase,
  getTopUseCase
);

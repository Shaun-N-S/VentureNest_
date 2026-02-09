import { projectModel } from "@infrastructure/db/models/projectModel";
import { projectMonthlyReportModel } from "@infrastructure/db/models/projectMonthlyReportModel";
import { projectRegistrationModel } from "@infrastructure/db/models/projectRegistrationModel";
import { userModel } from "@infrastructure/db/models/userModel";
import { walletModel } from "@infrastructure/db/models/walletModel";
import { ProjectMonthlyReportRepository } from "@infrastructure/repostiories/projectMontlyReportRepository";
import { ProjectRegistrationRepository } from "@infrastructure/repostiories/projectRegistrationRepository";
import { ProjectRepository } from "@infrastructure/repostiories/projectRepository";
import { UserRepository } from "@infrastructure/repostiories/userRepository";
import { WalletRepository } from "@infrastructure/repostiories/walletRepository";
import { StorageService } from "@infrastructure/services/storageService";
import { CreateProjectMonthlyReportUseCase } from "application/useCases/Project/createProjectMonthlyReportUseCase";
import { CreateProjectUseCase } from "application/useCases/Project/createProjectUseCase";
import { FetchAllProjectsUseCase } from "application/useCases/Project/fetchAllProjectsUseCase";
import { FetchPersonalProjectsUseCase } from "application/useCases/Project/fetchPersonalProjectsUseCase";
import { FetchProjectByIdUseCase } from "application/useCases/Project/fetchProjectByIdUseCase";
import { LikeProjectUseCase } from "application/useCases/Project/likeProjectUseCase";
import { RegisterProjectUseCase } from "application/useCases/Project/registerProjectUseCase";
import { RemoveProjectUseCase } from "application/useCases/Project/removeProjectsUseCase";
import { UpdateProjectUseCase } from "application/useCases/Project/updateProjectUseCase";
import { CreateWalletUseCase } from "application/useCases/Wallet/createWalletUseCase";
import { ProjectController } from "interfaceAdapters/controller/Project/projectController";
import { MonthlyReportController } from "interfaceAdapters/controller/Project/projectMonthlyReportController";
import { ProjectRegistrationController } from "interfaceAdapters/controller/Project/projectRegistrationController";

const projectRepo = new ProjectRepository(projectModel);
const projectMontlyReportRepo = new ProjectMonthlyReportRepository(projectMonthlyReportModel);
const projectRegisterRepo = new ProjectRegistrationRepository(projectRegistrationModel);
const storageService = new StorageService();
const walletRepo = new WalletRepository(walletModel);
const userRepo = new UserRepository(userModel);

const createWalletUseCase = new CreateWalletUseCase(walletRepo);
const createProjectUseCase = new CreateProjectUseCase(
  projectRepo,
  storageService,
  createWalletUseCase,
  userRepo
);
const fetchAllProjectsUseCase = new FetchAllProjectsUseCase(projectRepo, storageService);
const fetchPersonalProjectsUseCase = new FetchPersonalProjectsUseCase(projectRepo, storageService);
const removeProjectUseCase = new RemoveProjectUseCase(projectRepo, storageService);
const fetchProjectByIdUseCase = new FetchProjectByIdUseCase(projectRepo, storageService);
const updateProjectUseCase = new UpdateProjectUseCase(projectRepo, storageService);
const createMonthlyReportUseCase = new CreateProjectMonthlyReportUseCase(projectMontlyReportRepo);
const verifyProjectUseCase = new RegisterProjectUseCase(projectRegisterRepo, storageService);
const likeProjectUseCase = new LikeProjectUseCase(projectRepo);

export const projectController = new ProjectController(
  createProjectUseCase,
  fetchPersonalProjectsUseCase,
  fetchAllProjectsUseCase,
  removeProjectUseCase,
  fetchProjectByIdUseCase,
  updateProjectUseCase,
  likeProjectUseCase
);

export const projectMonthlyReportController = new MonthlyReportController(
  createMonthlyReportUseCase
);

export const projectRegistrationController = new ProjectRegistrationController(
  verifyProjectUseCase
);

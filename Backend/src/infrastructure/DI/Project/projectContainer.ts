import { projectModel } from "@infrastructure/db/models/projectModel";
import { projectMonthlyReportModel } from "@infrastructure/db/models/projectMonthlyReportModel";
import { ProjectMonthlyReportRepository } from "@infrastructure/repostiories/projectMontlyReportRepository";
import { ProjectRepository } from "@infrastructure/repostiories/projectRepository";
import { StorageService } from "@infrastructure/services/storageService";
import { CreateProjectMonthlyReportUseCase } from "application/useCases/Project/createProjectMonthlyReportUseCase";
import { CreateProjectUseCase } from "application/useCases/Project/createProjectUseCase";
import { FetchAllProjectsUseCase } from "application/useCases/Project/fetchAllProjectsUseCase";
import { FetchPersonalProjectsUseCase } from "application/useCases/Project/fetchPersonalProjectsUseCase";
import { FetchProjectByIdUseCase } from "application/useCases/Project/fetchProjectByIdUseCase";
import { RemoveProjectUseCase } from "application/useCases/Project/removeProjectsUseCase";
import { UpdateProjectUseCase } from "application/useCases/Project/updateProjectUseCase";
import { ProjectController } from "interfaceAdapters/controller/Project/projectController";
import { MonthlyReportController } from "interfaceAdapters/controller/Project/projectMonthlyReportController";

const projectRepo = new ProjectRepository(projectModel);
const projectMontlyReportRepo = new ProjectMonthlyReportRepository(projectMonthlyReportModel);
const storageService = new StorageService();

const createProjectUseCase = new CreateProjectUseCase(projectRepo, storageService);
const fetchAllProjectsUseCase = new FetchAllProjectsUseCase(projectRepo, storageService);
const fetchPersonalProjectsUseCase = new FetchPersonalProjectsUseCase(projectRepo, storageService);
const removeProjectUseCase = new RemoveProjectUseCase(projectRepo, storageService);
const fetchProjectByIdUseCase = new FetchProjectByIdUseCase(projectRepo, storageService);
const updateProjectUseCase = new UpdateProjectUseCase(projectRepo, storageService);
const createMonthlyReportUseCase = new CreateProjectMonthlyReportUseCase(projectMontlyReportRepo);

export const projectController = new ProjectController(
  createProjectUseCase,
  fetchPersonalProjectsUseCase,
  fetchAllProjectsUseCase,
  removeProjectUseCase,
  fetchProjectByIdUseCase,
  updateProjectUseCase
);

export const projectMonthlyReportController = new MonthlyReportController(
  createMonthlyReportUseCase
);

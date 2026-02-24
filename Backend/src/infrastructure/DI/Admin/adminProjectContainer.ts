import { projectModel } from "@infrastructure/db/models/projectModel";
import { projectRegistrationModel } from "@infrastructure/db/models/projectRegistrationModel";
import { ProjectRegistrationRepository } from "@infrastructure/repostiories/projectRegistrationRepository";
import { ProjectRepository } from "@infrastructure/repostiories/projectRepository";
import { StorageService } from "@infrastructure/services/storageService";
import { GetAllProjectRegistrationsUseCase } from "application/useCases/Admin/project/getAllProjectRegistrationsUseCase";
import { GetAllProjectsUseCase } from "application/useCases/Admin/project/getAllProjectUseCase";
import { UpdateProjectRegistrationStatusUseCase } from "application/useCases/Admin/project/updateProjectRegistrationStatusUseCase";
import { UpdateProjectStatusUseCase } from "application/useCases/Admin/project/updateProjectStatusUseCase";
import { AdminProjectController } from "interfaceAdapters/controller/Admin/adminProjectController";
import { AdminProjectRegistrationController } from "interfaceAdapters/controller/Admin/adminProjectRegistrationController";

const projectRepo = new ProjectRepository(projectModel);
const projectRegistrationRepo = new ProjectRegistrationRepository(projectRegistrationModel);
const storageService = new StorageService();

const getAllProjectUseCase = new GetAllProjectsUseCase(projectRepo);
const udpateProjectStatusUseCase = new UpdateProjectStatusUseCase(projectRepo);
const getAllProjectRegistrationsUseCase = new GetAllProjectRegistrationsUseCase(
  projectRegistrationRepo,
  storageService
);
const updateProjectRegistrationStatusUseCase = new UpdateProjectRegistrationStatusUseCase(
  projectRegistrationRepo
);
export const adminProjectController = new AdminProjectController(
  getAllProjectUseCase,
  udpateProjectStatusUseCase
);

export const adminProjectRegistrationController = new AdminProjectRegistrationController(
  getAllProjectRegistrationsUseCase,
  updateProjectRegistrationStatusUseCase
);

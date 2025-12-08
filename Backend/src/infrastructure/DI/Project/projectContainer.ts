import { projectModel } from "@infrastructure/db/models/projectModel";
import { ProjectRepository } from "@infrastructure/repostiories/projectRepository";
import { StorageService } from "@infrastructure/services/storageService";
import { CreateProjectUseCase } from "application/useCases/Project/createProjectUseCase";
import { FetchAllProjectsUseCase } from "application/useCases/Project/fetchAllProjectsUseCase";
import { FetchPersonalProjectsUseCase } from "application/useCases/Project/fetchPersonalProjectsUseCase";
import { FetchProjectByIdUseCase } from "application/useCases/Project/fetchProjectByIdUseCase";
import { RemoveProjectUseCase } from "application/useCases/Project/removeProjectsUseCase";
import { UpdateProjectUseCase } from "application/useCases/Project/updateProjectUseCase";
import { ProjectController } from "interfaceAdapters/controller/Project/projectController";

const projectRepo = new ProjectRepository(projectModel);
const storageService = new StorageService();

const createProjectUseCase = new CreateProjectUseCase(projectRepo, storageService);
const fetchAllProjectsUseCase = new FetchAllProjectsUseCase(projectRepo, storageService);
const fetchPersonalProjectsUseCase = new FetchPersonalProjectsUseCase(projectRepo, storageService);
const removeProjectUseCase = new RemoveProjectUseCase(projectRepo, storageService);
const fetchProjectByIdUseCase = new FetchProjectByIdUseCase(projectRepo, storageService);
const updateProjectUseCase = new UpdateProjectUseCase(projectRepo, storageService);

export const projectController = new ProjectController(
  createProjectUseCase,
  fetchPersonalProjectsUseCase,
  fetchAllProjectsUseCase,
  removeProjectUseCase,
  fetchProjectByIdUseCase,
  updateProjectUseCase
);

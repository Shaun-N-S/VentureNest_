import { projectModel } from "@infrastructure/db/models/projectModel";
import { ProjectRepository } from "@infrastructure/repostiories/projectRepository";
import { GetAllProjectsUseCase } from "application/useCases/Admin/project/getAllProjectUseCase";
import { UpdateProjectStatusUseCase } from "application/useCases/Admin/project/updateProjectStatusUseCase";
import { AdminProjectController } from "interfaceAdapters/controller/Admin/adminProjectController";

const projectRepo = new ProjectRepository(projectModel);

const getAllProjectUseCase = new GetAllProjectsUseCase(projectRepo);
const udpateProjectStatusUseCase = new UpdateProjectStatusUseCase(projectRepo);

export const adminProjectController = new AdminProjectController(
  getAllProjectUseCase,
  udpateProjectStatusUseCase
);

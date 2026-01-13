import { postModel } from "@infrastructure/db/models/postModel";
import { projectModel } from "@infrastructure/db/models/projectModel";
import { PostRepository } from "@infrastructure/repostiories/postRepository";
import { ProjectRepository } from "@infrastructure/repostiories/projectRepository";
import { StorageService } from "@infrastructure/services/storageService";
import { GetPostByIdUseCase } from "application/useCases/Admin/post/GetPostByIdUseCase";
import { GetProjectByIdUseCase } from "application/useCases/Admin/project/getProjectByIdUseCase";
import { AdminContentController } from "interfaceAdapters/controller/Admin/adminContentController";

//service and repository
const postRepository = new PostRepository(postModel);
const projectRepository = new ProjectRepository(projectModel);
const storageService = new StorageService();

//usecase
const getPostByIdUseCase = new GetPostByIdUseCase(postRepository, storageService);
const getProjectByIdUseCase = new GetProjectByIdUseCase(projectRepository, storageService);

//controller
export const adminContentController = new AdminContentController(
  getPostByIdUseCase,
  getProjectByIdUseCase
);

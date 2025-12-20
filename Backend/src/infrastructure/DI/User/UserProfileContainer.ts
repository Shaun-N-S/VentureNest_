import { postModel } from "@infrastructure/db/models/postModel";
import { projectModel } from "@infrastructure/db/models/projectModel";
import { relationshipModel } from "@infrastructure/db/models/relationshipModel";
import { userModel } from "@infrastructure/db/models/userModel";
import { PostRepository } from "@infrastructure/repostiories/postRepository";
import { ProjectRepository } from "@infrastructure/repostiories/projectRepository";
import { RelationshipRepository } from "@infrastructure/repostiories/relationshipRepository";
import { UserRepository } from "@infrastructure/repostiories/userRepository";
import { StorageService } from "@infrastructure/services/storageService";
import { FetchUserProfileUseCase } from "application/useCases/User/Profile/fetchUserProfileUseCase";
import { UpdateUserProfileUseCase } from "application/useCases/User/Profile/updateUserProfileUseCase";
import { UserProfileController } from "interfaceAdapters/controller/User/UserProfileController";

//Repository & Service
const userRepository = new UserRepository(userModel);
const storageService = new StorageService();
const relationshipRepo = new RelationshipRepository(relationshipModel);
const postRepo = new PostRepository(postModel);
const projectRepo = new ProjectRepository(projectModel);

//useCases
const fetchUserProfileUseCase = new FetchUserProfileUseCase(
  userRepository,
  storageService,
  relationshipRepo,
  postRepo,
  projectRepo
);
const updateUserProfileUseCase = new UpdateUserProfileUseCase(userRepository, storageService);

//controller
export const userProfileController = new UserProfileController(
  updateUserProfileUseCase,
  fetchUserProfileUseCase
);

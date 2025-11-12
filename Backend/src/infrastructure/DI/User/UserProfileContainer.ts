import { userModel } from "@infrastructure/db/models/userModel";
import { UserRepository } from "@infrastructure/repostiories/userRepository";
import { StorageService } from "@infrastructure/services/storageService";
import { FetchUserProfileUseCase } from "application/useCases/User/Profile/fetchUserProfileUseCase";
import { UpdateUserProfileUseCase } from "application/useCases/User/Profile/UpdateUserProfileUseCase";
import { UserProfileController } from "interfaceAdapters/controller/User/UserProfileController";

//Repository & Service
const userRepository = new UserRepository(userModel);
const storageService = new StorageService();

//useCases
const fetchUserProfileUseCase = new FetchUserProfileUseCase(userRepository, storageService);
const updateUserProfileUseCase = new UpdateUserProfileUseCase(userRepository, storageService);

//controller
export const userProfileController = new UserProfileController(
  updateUserProfileUseCase,
  fetchUserProfileUseCase
);

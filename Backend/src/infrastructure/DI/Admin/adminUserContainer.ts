import { userModel } from "@infrastructure/db/models/userModel";
import { UserRepository } from "@infrastructure/repostiories/userRepository";
import { GetAllUsersUseCase } from "application/useCases/Admin/user/getAllUsersUseCase";
import { UpdateUserStatusUseCase } from "application/useCases/Admin/user/updateUserStatusUseCase";
import { AdminUserController } from "interfaceAdapters/controller/Admin/adminUserController";

//Repository & Service
const userRepository = new UserRepository(userModel);

//UseCases
const getAllUserUseCase = new GetAllUsersUseCase(userRepository);
const updateUserStatus = new UpdateUserStatusUseCase(userRepository);

//Controllers
export const adminUserController = new AdminUserController(getAllUserUseCase, updateUserStatus);

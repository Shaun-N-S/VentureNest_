import { CreateUserDTO } from "application/dto/user/createUserDTO";

export interface ICreateUserUseCase {
  createUser(user: CreateUserDTO): Promise<void>;
}

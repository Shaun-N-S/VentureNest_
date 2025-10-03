import { CreateUserDTO } from "application/dto/auth/createUserDTO";

export interface ICreateUserUseCase {
  createUser(email: string): Promise<void>;
}

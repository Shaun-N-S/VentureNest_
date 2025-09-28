import { IUserRepository } from "@domain/interfaces/repositories/IUserRepository";
import { IHashPasswordService } from "@domain/interfaces/services/IHashPasswordService";
import { USER_ERRORS } from "@shared/constants/error";
import { CreateUserDTO } from "application/dto/user/createUserDTO";
import { UserMapper } from "application/mappers/userMappers";
import { ICreateUserUseCase } from "@domain/interfaces/useCases/user/auth/ICreateUserUseCase";

export class RegisterUserUseCase implements ICreateUserUseCase {
  constructor(
    private _userRepository: IUserRepository,
    private _hashService: IHashPasswordService
  ) {}

  async createUser(user: CreateUserDTO): Promise<void> {
    const existingUser = await this._userRepository.findByEmail(user.email);
    if (existingUser) {
      throw new Error(USER_ERRORS.USER_ALREADY_EXISTS);
    }

    const hashedPassword = await this._hashService.hashPassword(user.password);
    const userEntity = UserMapper.toEntity({ ...user, password: hashedPassword });

    await this._userRepository.save(userEntity);
  }
}

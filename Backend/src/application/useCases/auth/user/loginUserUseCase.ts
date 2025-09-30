import { UserStatus } from "@domain/enum/userStatus";
import { IUserRepository } from "@domain/interfaces/repositories/IUserRepository";
import { IHashPasswordService } from "@domain/interfaces/services/IHashPasswordService";
import { IUserLoginUseCase } from "@domain/interfaces/useCases/auth/user/IUserLoginUseCase";
import { Errors, USER_ERRORS } from "@shared/constants/error";
import { LoginUserDTO } from "application/dto/user/LoginUserDTO";
import { UserMapper } from "application/mappers/userMappers";

export class UserLoginUseCase implements IUserLoginUseCase {
  private _userRepository;
  private _hashService;

  constructor(userRepository: IUserRepository, hashService: IHashPasswordService) {
    this._userRepository = userRepository;
    this._hashService = hashService;
  }

  async userLogin(email: string, password: string): Promise<LoginUserDTO> {
    const user = await this._userRepository.findByEmail(email);

    if (!user) {
      throw new Error(USER_ERRORS.USER_NOT_FOUND);
    }

    if (user.status === UserStatus.BLOCKED) {
      throw new Error(USER_ERRORS.USER_BLOCKED);
    }

    const verifyPassword = await this._hashService.compare(password, user.password);

    if (!verifyPassword) {
      throw new Error(Errors.INVALID_CREDENTIALS);
    }

    const response: LoginUserDTO = UserMapper.toLoginUserResponse(user);
    return response;
  }
}

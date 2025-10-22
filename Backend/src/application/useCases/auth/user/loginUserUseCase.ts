import { UserStatus } from "@domain/enum/userStatus";
import { IUserRepository } from "@domain/interfaces/repositories/IUserRepository";
import { IHashPasswordService } from "@domain/interfaces/services/IHashPasswordService";
import { IUserLoginUseCase } from "@domain/interfaces/useCases/auth/user/IUserLoginUseCase";
import { Errors, USER_ERRORS } from "@shared/constants/error";
import {
  InvalidDataException,
  IsBlockedExecption,
  NotFoundExecption,
  PasswordNotMatchingException,
} from "application/constants/exceptions";
import { LoginUserResponseDTO } from "application/dto/auth/LoginUserDTO";
import { UserMapper } from "application/mappers/userMappers";

export class UserLoginUseCase implements IUserLoginUseCase {
  private _userRepository;
  private _hashService;

  constructor(userRepository: IUserRepository, hashService: IHashPasswordService) {
    this._userRepository = userRepository;
    this._hashService = hashService;
  }

  async userLogin(email: string, password: string): Promise<LoginUserResponseDTO> {
    const user = await this._userRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundExecption(USER_ERRORS.USER_NOT_FOUND);
    }

    if (user.status === UserStatus.BLOCKED) {
      throw new IsBlockedExecption(USER_ERRORS.USER_BLOCKED);
    }

    if (!user.password) {
      if (user.googleId) {
        throw new PasswordNotMatchingException(Errors.INVALID_LOGIN_TYPE);
      }
      throw new PasswordNotMatchingException(Errors.PASSWORD_NOT_MATCHING);
    }

    const verifyPassword = await this._hashService.compare(password, user.password);

    if (!verifyPassword) {
      throw new InvalidDataException(Errors.INVALID_CREDENTIALS);
    }

    const response: LoginUserResponseDTO = UserMapper.toLoginUserResponse(user);
    return response;
  }
}

import { UserRole } from "@domain/enum/userRole";
import { IUserRepository } from "@domain/interfaces/repositories/IUserRepository";
import { IHashPasswordService } from "@domain/interfaces/services/IHashPasswordService";
import { IAdminLoginUseCase } from "@domain/interfaces/useCases/auth/admin/IAdminLoginUseCase";
import { Errors, USER_ERRORS } from "@shared/constants/error";
import {
  InvalidDataException,
  NotFoundExecption,
  PasswordNotMatchingException,
} from "application/constants/exceptions";
import { LoginAdminResponseDTO } from "application/dto/auth/LoginAdminDTO";
import { UserMapper } from "application/mappers/userMappers";

export class AdminLoginUseCase implements IAdminLoginUseCase {
  constructor(
    private _userRepository: IUserRepository,
    private _hashService: IHashPasswordService
  ) {}

  async adminLogin(email: string, password: string): Promise<LoginAdminResponseDTO> {
    const user = await this._userRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundExecption(USER_ERRORS.USER_NOT_FOUND);
    }

    if (user.role !== UserRole.ADMIN) {
      throw new InvalidDataException(Errors.INVALID_CREDENTIALS);
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

    const response: LoginAdminResponseDTO = UserMapper.toLoginAdminResponse(user);
    return response;
  }
}

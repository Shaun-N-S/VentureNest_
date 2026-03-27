import { CONFIG } from "@config/config";
import { UserStatus } from "@domain/enum/userStatus";
import { IUserRepository } from "@domain/interfaces/repositories/IUserRepository";
import { IKeyValueTTLCaching } from "@domain/interfaces/services/ICache/IKeyValueTTLCaching";
import { IHashPasswordService } from "@domain/interfaces/services/IHashPasswordService";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";
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
  private _storageService;
  private _cacheService;

  constructor(
    userRepository: IUserRepository,
    hashService: IHashPasswordService,
    storageService: IStorageService,
    cacheService: IKeyValueTTLCaching
  ) {
    this._userRepository = userRepository;
    this._hashService = hashService;
    this._storageService = storageService;
    this._cacheService = cacheService;
  }

  async userLogin(email: string, password: string): Promise<LoginUserResponseDTO> {
    const user = await this._userRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundExecption(USER_ERRORS.USER_NOT_FOUND);
    }

    if (user.status === UserStatus.BLOCKED) {
      throw new IsBlockedExecption(USER_ERRORS.USER_BLOCKED);
    }

    await this._cacheService.setData(`USER_STATUS:${user._id}`, 60 * 15, user.status);

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
    if (response.profileImg) {
      response.profileImg = await this._storageService.createSignedUrl(
        response.profileImg,
        CONFIG.SIGNED_URL_EXPIRY
      );
    }
    return response;
  }
}

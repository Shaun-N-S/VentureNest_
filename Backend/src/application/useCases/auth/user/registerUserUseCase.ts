import { IUserRepository } from "@domain/interfaces/repositories/IUserRepository";
import { USER_ERRORS } from "@shared/constants/error";
import { UserMapper } from "application/mappers/userMappers";
import { ICreateUserUseCase } from "@domain/interfaces/useCases/auth/user/ICreateUserUseCase";
import { IKeyValueTTLCaching } from "@domain/interfaces/services/ICache/IKeyValueTTLCaching";
import { redisRegisterSchema } from "@shared/validations/userRegisterValidator";
import { AlreadyExisitingExecption } from "application/constants/exceptions";
import { ICreateWalletUseCase } from "@domain/interfaces/useCases/wallet/ICreateWalletUseCase";
import { WalletOwnerType } from "@domain/enum/walletOwnerType";

export class RegisterUserUseCase implements ICreateUserUseCase {
  constructor(
    private _userRepository: IUserRepository,
    private _cacheStorage: IKeyValueTTLCaching,
    private _createWalletUseCase: ICreateWalletUseCase
  ) {}

  async createUser(email: string): Promise<void> {
    const existingUser = await this._userRepository.findByEmail(email);
    if (existingUser) {
      throw new AlreadyExisitingExecption(USER_ERRORS.USER_ALREADY_EXISTS);
    }

    const redisUserData = await this._cacheStorage.getData(`USERDATA/${email}`);
    const userData = redisRegisterSchema.safeParse(JSON.parse(redisUserData!));

    console.log(redisUserData);
    console.log("userData from redis :", userData.data);

    const userEntity = UserMapper.toEntity(userData.data!);

    const savedUser = await this._userRepository.save(userEntity);

    await this._createWalletUseCase.execute(WalletOwnerType.USER, savedUser._id!);
  }
}

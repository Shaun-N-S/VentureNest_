import { IKeyValueTTLCaching } from "@domain/interfaces/services/ICache/IKeyValueTTLCaching";
import { ICacheUserUseCase } from "@domain/interfaces/useCases/auth/user/ICacheUserUseCase";
import { LoginUserResponseDTO } from "application/dto/auth/LoginUserDTO";

export class CacheUserUseCase implements ICacheUserUseCase {
  constructor(private _cacheData: IKeyValueTTLCaching) {}

  cacheUser(user: LoginUserResponseDTO): void {
    this._cacheData.setData(`user/${user._id}`, 15 * 60, JSON.stringify(user));
  }
}

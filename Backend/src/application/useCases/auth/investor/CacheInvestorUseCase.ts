import { IKeyValueTTLCaching } from "@domain/interfaces/services/ICache/IKeyValueTTLCaching";
import { ICacheInvestorUseCase } from "@domain/interfaces/useCases/auth/investor/ICacheInvestorUseCase";
import { LoginUserResponseDTO } from "application/dto/auth/LoginUserDTO";

export class CacheInvestorUseCase implements ICacheInvestorUseCase {
  constructor(private _cacheData: IKeyValueTTLCaching) {}

  cacheInvestor(investor: LoginUserResponseDTO): void {
    this._cacheData.setData(`investor/${investor._id}`, 15 * 60, JSON.stringify(investor));
  }
}

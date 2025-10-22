import { IKeyValueTTLCaching } from "@domain/interfaces/services/ICache/IKeyValueTTLCaching";
import { IJWTService } from "@domain/interfaces/services/IJWTService";
import { ITokenInvalidationUseCase } from "@domain/interfaces/useCases/auth/ITokenInvalidationUseCase";
import { Errors } from "@shared/constants/error";
import { TokenMissingException } from "application/constants/exceptions";

export class TokenInvalidationUseCase implements ITokenInvalidationUseCase {
  constructor(
    private _jwtService: IJWTService,
    private _cacheService: IKeyValueTTLCaching
  ) {}

  async refreshToken(token: string): Promise<void> {
    const decodedId = this._jwtService.verifyRefreshToken(token);
    console.log(decodedId);
    if (!decodedId) {
      throw new TokenMissingException(Errors.INVALID_TOKEN);
    }
    await this._cacheService.setData(`blackList:${token}`, 7 * 24 * 60 * 60, "blackListed");
  }

  async accessToken(token: string): Promise<void> {
    const decodedId = this._jwtService.verifyAccessToken(token);
    console.log(decodedId);
    if (!decodedId) {
      throw new TokenMissingException(Errors.INVALID_TOKEN);
    }
    await this._cacheService.setData(`blackList:${token}`, 15 * 60, "blackListed");
  }
}

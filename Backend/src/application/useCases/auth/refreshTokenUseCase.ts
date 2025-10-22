import { IKeyValueTTLCaching } from "@domain/interfaces/services/ICache/IKeyValueTTLCaching";
import { IJWTService } from "@domain/interfaces/services/IJWTService";
import { IRefreshTokenUseCase } from "@domain/interfaces/useCases/auth/IRefreshToken";
import { Errors } from "@shared/constants/error";
import { InvalidDataException, TokenExpiredException } from "application/constants/exceptions";

export class RefreshTokenUseCase implements IRefreshTokenUseCase {
  constructor(
    private _jwtService: IJWTService,
    private _cacheStorage: IKeyValueTTLCaching
  ) {}

  async refresh(token: string): Promise<string> {
    const blackListed = await this._cacheStorage.getData(`blackList:${token}`);

    if (blackListed) {
      throw new InvalidDataException("Token blacklisted !");
    }

    const decoded = this._jwtService.verifyRefreshToken(token);

    if (!decoded) {
      throw new TokenExpiredException(Errors.REFRESH_TOKEN_EXPIRED);
    }

    const accessToken = this._jwtService.createAccessToken({
      userId: decoded.userId,
      role: decoded.role,
    });

    return accessToken;
  }
}

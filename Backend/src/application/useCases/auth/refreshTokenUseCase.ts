import { IJWTService } from "@domain/interfaces/services/IJWTService";
import { IRefreshTokenUseCase } from "@domain/interfaces/useCases/auth/IRefreshToken";
import { Errors } from "@shared/constants/error";

export class RefreshTokenUseCase implements IRefreshTokenUseCase {
  constructor(private _jwtService: IJWTService) {}

  async refresh(token: string): Promise<string> {
    const decoded = this._jwtService.verifyRefreshToken(token);

    if (!decoded) {
      throw new Error(Errors.REFRESH_TOKEN_EXPIRED);
    }

    const accessToken = this._jwtService.createAccessToken({
      userId: decoded.userId,
      role: decoded.role,
    });

    return accessToken;
  }
}

import { IJWTService } from "@domain/interfaces/services/IJWTService";
import { ITokenCreationUseCase } from "@domain/interfaces/useCases/auth/ITokenCreation";
import { JWTPayloadType } from "@domain/types/JWTPayloadTypes";

export class TokenCreationUseCase implements ITokenCreationUseCase {
  constructor(private _JWTService: IJWTService) {}

  createAccessTokenAndRefreshToken(payload: JWTPayloadType): {
    accessToken: string;
    refreshToken: string;
  } {
    const accessToken = this._JWTService.createAccessToken(payload);
    const refreshToken = this._JWTService.createRefreshToken(payload);

    return { accessToken, refreshToken };
  }
}

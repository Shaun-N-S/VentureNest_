import { JWTPayloadType } from "@domain/types/JWTPayloadTypes";

export interface ITokenCreationUseCase {
  createAccessTokenAndRefreshToken(payload: JWTPayloadType): {
    accessToken: string;
    refreshToken: string;
  };
}

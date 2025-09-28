import { JWTPayloadType } from "domain/types/JWTPayloadTypes";

export interface IJWTService {
  createAccessToken(payload: JWTPayloadType): string;
  createRefreshToken(payload: JWTPayloadType): string;
  verifyAccessToken(token: string): JWTPayloadType | null;
  verifyRefreshToken(token: string): JWTPayloadType | null;
}

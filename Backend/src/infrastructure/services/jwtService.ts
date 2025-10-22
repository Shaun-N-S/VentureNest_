import { CONFIG } from "@config/config";
import { Errors } from "@shared/constants/error";
import { TokenExpiredException } from "application/constants/exceptions";
import { IJWTService } from "domain/interfaces/services/IJWTService";
import { JWTPayloadType } from "domain/types/JWTPayloadTypes";
import { verify, sign } from "jsonwebtoken";

export class JWTService implements IJWTService {
  createAccessToken(payload: JWTPayloadType): string {
    const secertKey = CONFIG.JWT_SECRET;
    if (!secertKey) {
      throw new Error("Access Token Secret Key Not Found");
    }

    return sign(payload, secertKey, { expiresIn: "15m" });
  }

  createRefreshToken(payload: JWTPayloadType): string {
    const secertKey = CONFIG.JWT_SECRET;
    if (!secertKey) {
      throw new Error("Access Token Secret Key Not Found");
    }

    return sign(payload, secertKey, { expiresIn: "7d" });
  }

  verifyAccessToken(token: string): JWTPayloadType | null {
    const secertKey = CONFIG.JWT_SECRET;
    if (!secertKey) {
      throw new Error("Access Token Secret Key Not Found");
    }
    try {
      const decoded = verify(token, secertKey);
      if (decoded) {
        return decoded as JWTPayloadType;
      }
      return null;
    } catch (error) {
      throw new TokenExpiredException(Errors.INVALID_TOKEN);
    }
  }

  verifyRefreshToken(token: string): JWTPayloadType | null {
    const secertKey = CONFIG.JWT_SECRET;
    if (!secertKey) {
      throw new Error("Access Token Secret Key Not Found");
    }

    const decoded = verify(token, secertKey);
    if (!decoded) return null;
    return decoded as JWTPayloadType;
  }
}

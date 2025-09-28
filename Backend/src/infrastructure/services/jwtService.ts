import { CONFIG } from "@config/config";
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

    return sign(payload, secertKey, { expiresIn: "1d" });
  }

  verifyAccessToken(token: string): JWTPayloadType | null {
    const secertKey = CONFIG.JWT_SECRET;
    if (!secertKey) {
      throw new Error("Access Token Secret Key Not Found");
    }

    verify(token, secertKey, (err, decoded) => {
      if (err) return null;
      return decoded as JWTPayloadType;
    });

    return null;
  }

  verifyRefreshToken(token: string): JWTPayloadType | null {
    const secertKey = CONFIG.JWT_SECRET;
    if (!secertKey) {
      throw new Error("Access Token Secret Key Not Found");
    }

    verify(token, secertKey, (err, decoded) => {
      if (err) return null;
      return decoded as JWTPayloadType;
    });

    return null;
  }
}

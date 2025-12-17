import { CONFIG } from "@config/config";
import { Errors } from "@shared/constants/error";
import {
  TokenExpiredException,
  TokenMissingException,
  InvalidDataException,
} from "application/constants/exceptions";
import { IJWTService } from "domain/interfaces/services/IJWTService";
import { JWTPayloadType } from "domain/types/JWTPayloadTypes";
import { sign, verify } from "jsonwebtoken";

export class JWTService implements IJWTService {
  createAccessToken(payload: JWTPayloadType): string {
    const secretKey = CONFIG.JWT_SECRET;
    const expiresIn = Number(CONFIG.ACCESS_TOKEN_EXPIRES_TIME);
    if (!secretKey) {
      throw new TokenMissingException(Errors.ACCESS_TOKEN_SECRETKEY_MISSING);
    }

    try {
      return sign(payload, secretKey, { expiresIn });
    } catch (error) {
      console.log(error);
      throw new InvalidDataException(Errors.ACCESS_TOKEN_CREATION_FAILED);
    }
  }

  createRefreshToken(payload: JWTPayloadType): string {
    const secretKey = CONFIG.JWT_SECRET;
    const expiresIn = Number(CONFIG.REFRESH_TOKEN_EXPIRES_TIME);
    if (!secretKey) {
      throw new TokenMissingException(Errors.REFRESH_TOKEN_SECRETKEY_MISSING);
    }

    try {
      return sign(payload, secretKey, { expiresIn });
    } catch (error) {
      console.log(error);
      throw new InvalidDataException(Errors.REFRESH_TOKEN_CREATION_FAILED);
    }
  }

  verifyAccessToken(token: string): JWTPayloadType | null {
    const secretKey = CONFIG.JWT_SECRET;
    if (!secretKey) {
      throw new TokenMissingException(Errors.ACCESS_TOKEN_SECRETKEY_MISSING);
    }

    if (!token) {
      throw new TokenMissingException(Errors.ACCESS_TOKEN_MISSING);
    }

    try {
      const decoded = verify(token, secretKey);
      return decoded as JWTPayloadType;
    } catch (error: any) {
      throw new TokenExpiredException(
        error.name === "TokenExpiredError" ? Errors.TOKEN_EXPIRED : Errors.INVALID_TOKEN
      );
    }
  }

  verifyRefreshToken(token: string): JWTPayloadType | null {
    const secretKey = CONFIG.JWT_SECRET;
    if (!secretKey) {
      throw new TokenMissingException(Errors.REFRESH_TOKEN_SECRETKEY_MISSING);
    }

    if (!token) {
      throw new TokenMissingException(Errors.REFRESH_TOKEN_MISSING);
    }

    try {
      const decoded = verify(token, secretKey);
      return decoded as JWTPayloadType;
    } catch (error: any) {
      throw new TokenExpiredException(
        error.name === "TokenExpiredError" ? Errors.TOKEN_EXPIRED : Errors.INVALID_TOKEN
      );
    }
  }
}

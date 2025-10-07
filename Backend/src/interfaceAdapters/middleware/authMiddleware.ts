import { IKeyValueTTLCaching } from "@domain/interfaces/services/ICache/IKeyValueTTLCaching";
import { IJWTService } from "@domain/interfaces/services/IJWTService";
import { Errors } from "@shared/constants/error";
import { HTTPStatus } from "@shared/constants/httpStatus";
import { Request, Response } from "express";

export class AuthMiddleware {
  constructor(
    private _jwtService: IJWTService,
    private _cacheService: IKeyValueTTLCaching
  ) {}

  verify = async (req: Request, res: Response) => {
    const header = req.header("Authorization");

    if (!header?.startsWith("Bearer ")) {
      res.status(HTTPStatus.UNAUTHORIZED).json({ success: false, message: Errors.INVALID_TOKEN });
      return;
    }

    const token = header.split(" ")[1];
    const decoded = this._jwtService.verifyAccessToken(token as string);
    if (!decoded) {
      res.status(HTTPStatus.UNAUTHORIZED).json({ success: false, message: Errors.INVALID_TOKEN });
      return;
    }

    const blackListed = await this._cacheService.getData(`blackList:${decoded.userId}`); //jti

    if (blackListed) {
      res.status(HTTPStatus.UNAUTHORIZED).json({ success: false, message: Errors.INVALID_TOKEN });
      return;
    }
    (req as any).user = { role: decoded.role, userId: decoded.userId };
  };
}

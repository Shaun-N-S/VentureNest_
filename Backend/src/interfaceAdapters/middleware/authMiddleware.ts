import { IKeyValueTTLCaching } from "@domain/interfaces/services/ICache/IKeyValueTTLCaching";
import { IJWTService } from "@domain/interfaces/services/IJWTService";
import { Errors } from "@shared/constants/error";
import { HTTPSTATUS } from "@shared/constants/httpStatus";
import { NextFunction, Request, Response } from "express";

export class AuthMiddleware {
  constructor(
    private _jwtService: IJWTService,
    private _cacheService: IKeyValueTTLCaching
  ) {}

  verify = async (req: Request, res: Response, next: NextFunction) => {
    const header = req.header("Authorization");

    if (!header?.startsWith("Bearer ")) {
      res.status(HTTPSTATUS.UNAUTHORIZED).json({ success: false, message: Errors.INVALID_TOKEN });
      return;
    }
    console.log("bearer");
    const token = header.split(" ")[1];
    const decoded = this._jwtService.verifyAccessToken(token as string);
    console.log(decoded);
    if (!decoded) {
      res.status(HTTPSTATUS.UNAUTHORIZED).json({ success: false, message: Errors.INVALID_TOKEN });
      return;
    }
    console.log("verified");

    const blackListed = await this._cacheService.getData(`blackList:${token}`);

    if (blackListed) {
      res.status(HTTPSTATUS.UNAUTHORIZED).json({ success: false, message: Errors.INVALID_TOKEN });
      return;
    }
    res.locals.user = { role: decoded.role, userId: decoded.userId };
    next();
  };

  checkStatus = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
      const { id } = res.locals.users;

      let userStatus;
    };
  };
}

import { UserRole } from "@domain/enum/userRole";
import { UserStatus } from "@domain/enum/userStatus";
import { IInvestorRepository } from "@domain/interfaces/repositories/IInvestorRespository";
import { IUserRepository } from "@domain/interfaces/repositories/IUserRepository";
import { IKeyValueTTLCaching } from "@domain/interfaces/services/ICache/IKeyValueTTLCaching";
import { IJWTService } from "@domain/interfaces/services/IJWTService";
import { Errors, USER_ERRORS } from "@shared/constants/error";
import { HTTPSTATUS } from "@shared/constants/httpStatus";
import { NextFunction, Request, Response } from "express";

export class AuthMiddleware {
  constructor(
    private _jwtService: IJWTService,
    private _cacheService: IKeyValueTTLCaching,
    private _userRepo: IUserRepository,
    private _investorRepo: IInvestorRepository
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

  checkStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = res.locals?.user?.userId;
      const role = res.locals?.user?.role;
      console.log("userid and role : ,", userId, role);
      let status = await this._cacheService.getData(`USER_STATUS:${userId}`);
      console.log("status of users  : ", status);
      if (!status) {
        if (role === UserRole.USER) {
          status = await this._userRepo.getStatus(userId);
        }

        if (role === UserRole.INVESTOR) {
          status = await this._investorRepo.getStatus(userId);
        }

        await this._cacheService.setData(`USER_STATUS:${userId}`, 60 * 15, status!);
      }

      if (status === UserStatus.BLOCKED) {
        return res.status(HTTPSTATUS.FORBIDDEN).json({
          success: false,
          message: USER_ERRORS.USER_BLOCKED,
        });
      }

      next();
    } catch (error) {
      console.error(error);
      next(error);
    }
  };
}

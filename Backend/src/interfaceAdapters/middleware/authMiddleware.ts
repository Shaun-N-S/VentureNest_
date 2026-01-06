import { UserRole } from "@domain/enum/userRole";
import { UserStatus } from "@domain/enum/userStatus";
import { IInvestorRepository } from "@domain/interfaces/repositories/IInvestorRespository";
import { IUserRepository } from "@domain/interfaces/repositories/IUserRepository";
import { IKeyValueTTLCaching } from "@domain/interfaces/services/ICache/IKeyValueTTLCaching";
import { IJWTService } from "@domain/interfaces/services/IJWTService";
import { Errors, USER_ERRORS } from "@shared/constants/error";
import { HTTPSTATUS } from "@shared/constants/httpStatus";
import { ResponseHelper } from "@shared/utils/responseHelper";
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
      ResponseHelper.error(res, Errors.INVALID_TOKEN, HTTPSTATUS.UNAUTHORIZED);
      return;
    }
    console.log("bearer");
    const token = header.split(" ")[1];
    const decoded = this._jwtService.verifyAccessToken(token as string);
    console.log(decoded);
    if (!decoded) {
      ResponseHelper.error(res, Errors.INVALID_TOKEN, HTTPSTATUS.UNAUTHORIZED);
      return;
    }
    console.log("verified");

    const blackListed = await this._cacheService.getData(`blackList:${token}`);

    if (blackListed) {
      ResponseHelper.error(res, Errors.INVALID_TOKEN, HTTPSTATUS.UNAUTHORIZED);
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

      if (!userId || !role) {
        ResponseHelper.error(res, Errors.INVALID_TOKEN, HTTPSTATUS.UNAUTHORIZED);
        return;
      }
      let status = await this._cacheService.getData(`USER_STATUS:${userId}`);
      console.log("status of users  : ", status);
      if (!status) {
        if (role === UserRole.USER || role === UserRole.ADMIN) {
          status = await this._userRepo.getStatus(userId);
          console.log("status from user repo : ,", status);
        }

        if (role === UserRole.INVESTOR) {
          status = await this._investorRepo.getStatus(userId);
          console.log("status from investor repo : ,", status);
        }

        await this._cacheService.setData(`USER_STATUS:${userId}`, 60 * 15, status!);
      }

      if (status === UserStatus.BLOCKED) {
        ResponseHelper.error(res, USER_ERRORS.USER_BLOCKED, HTTPSTATUS.FORBIDDEN);
        return;
      }

      next();
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  authorizeRole = (roles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const role = res.locals?.user?.role;
      if (!role || !roles.includes(role)) {
        ResponseHelper.error(res, Errors.UNAUTHORIZED_ACCESS, HTTPSTATUS.FORBIDDEN);
        return;
      }
      next();
    };
  };
}

import { UserRole } from "@domain/enum/userRole";
import { IAdminLoginUseCase } from "@domain/interfaces/useCases/auth/admin/IAdminLoginUseCase";
import { ITokenCreationUseCase } from "@domain/interfaces/useCases/auth/ITokenCreation";
import { ICacheUserUseCase } from "@domain/interfaces/useCases/auth/user/ICacheUserUseCase";
import { HTTPSTATUS } from "@shared/constants/httpStatus";
import { MESSAGES } from "@shared/constants/messages";
import { ResponseHelper } from "@shared/utils/responseHelper";
import { setRefreshTokenCookie } from "@shared/utils/setRefreshTokenCookie";
import { loginSchema } from "@shared/validations/loginValidator";
import { NextFunction, Request, Response } from "express";

export class AdminAuthController {
  constructor(
    private _adminLoginUseCase: IAdminLoginUseCase,
    private _cacheUserUseCaes: ICacheUserUseCase,
    private _tokenCreationUseCase: ITokenCreationUseCase
  ) {}

  async adminLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = loginSchema.parse(req.body);

      const user = await this._adminLoginUseCase.adminLogin(email, password);
      console.log(user);

      const token = this._tokenCreationUseCase.createAccessTokenAndRefreshToken({
        userId: user._id.toString(),
        role: UserRole.ADMIN,
      });

      setRefreshTokenCookie(res, token.refreshToken);

      // await this._cacheUserUseCaes.cacheUser(user);

      ResponseHelper.success(
        res,
        MESSAGES.USERS.LOGIN_SUCCESS,
        { user, accessToken: token.accessToken },
        HTTPSTATUS.OK
      );
    } catch (error) {
      next(error);
    }
  }
}

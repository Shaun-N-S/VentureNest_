import { UserRole } from "@domain/enum/userRole";
import { IAdminLoginUseCase } from "@domain/interfaces/useCases/auth/admin/IAdminLoginUseCase";
import { ITokenCreationUseCase } from "@domain/interfaces/useCases/auth/ITokenCreation";
import { Errors } from "@shared/constants/error";
import { HTTPSTATUS } from "@shared/constants/httpStatus";
import { MESSAGES } from "@shared/constants/messages";
import { ResponseHelper } from "@shared/utils/responseHelper";
import { setRefreshTokenCookie } from "@shared/utils/setRefreshTokenCookie";
import { loginSchema } from "@shared/validations/loginValidator";
import { InvalidDataException } from "application/constants/exceptions";
import { NextFunction, Request, Response } from "express";

export class AdminAuthController {
  constructor(
    private _adminLoginUseCase: IAdminLoginUseCase,
    private _tokenCreationUseCase: ITokenCreationUseCase
  ) {}

  async adminLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = loginSchema.safeParse(req.body);

      if (data.error) {
        throw new InvalidDataException(data.error.issues[0]?.message || Errors.INVALID_DATA);
      }

      const { email, password } = data.data;

      const user = await this._adminLoginUseCase.adminLogin(email, password);

      if (!user) {
        throw new InvalidDataException(Errors.INVALID_CREDENTIALS);
      }

      const token = this._tokenCreationUseCase.createAccessTokenAndRefreshToken({
        userId: user._id.toString(),
        role: UserRole.ADMIN,
      });

      setRefreshTokenCookie(res, token.refreshToken);

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

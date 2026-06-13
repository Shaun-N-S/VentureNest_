import { UserRole } from "@domain/enum/userRole";
import { IInvestorRepository } from "@domain/interfaces/repositories/IInvestorRespository";
import { IUserRepository } from "@domain/interfaces/repositories/IUserRepository";
import { IJWTService } from "@domain/interfaces/services/IJWTService";
import { IForgetPasswordInvestorResetPasswordUseCase } from "@domain/interfaces/useCases/auth/IForgetPasswordInvestorResetPassword";
import { IForgetPasswordSendOtpUseCaes } from "@domain/interfaces/useCases/auth/IForgetPasswordSendOtp";
import { IForgetPasswordVerifyOtpUseCase } from "@domain/interfaces/useCases/auth/IForgetPasswordVerifyOtp";
import { IGoogleLoginUseCase } from "@domain/interfaces/useCases/auth/IGoogleLoginUseCase";
import { ICacheInvestorUseCase } from "@domain/interfaces/useCases/auth/investor/ICacheInvestorUseCase";
import { ICreateInvestorUseCase } from "@domain/interfaces/useCases/auth/investor/ICreateInvestorUseCase";
import { IInvestorLoginUseCase } from "@domain/interfaces/useCases/auth/investor/IInvestorLoginUseCase";
import { IResendOtpUseCase } from "@domain/interfaces/useCases/auth/IResendOtp";
import { ITokenCreationUseCase } from "@domain/interfaces/useCases/auth/ITokenCreation";
import { IVerifyOtpUseCase } from "@domain/interfaces/useCases/auth/IVerifyOtp";
import { ISignUpSendOtpUseCase } from "@domain/interfaces/useCases/auth/user/ISignUpSendOtp";
import { Errors, INVESTOR_ERRORS, USER_ERRORS } from "@shared/constants/error";
import { HTTPSTATUS } from "@shared/constants/httpStatus";
import { MESSAGES } from "@shared/constants/messages";
import { ResponseHelper } from "@shared/utils/responseHelper";
import { setRefreshTokenCookie } from "@shared/utils/setRefreshTokenCookie";
import { changePasswordSchema } from "@shared/validations/changePasswordValidator";
import { emailSchema } from "@shared/validations/emailValidator";
import { forgetPasswordResetPasswordSchema } from "@shared/validations/forgetPasswordResetPasswordValidator";
import { forgetPasswordVerifyOtpSchema } from "@shared/validations/forgetPasswordVerifyOtpValidator";
import { googleLoginSchema } from "@shared/validations/googleLoginValidator";
import { loginSchema } from "@shared/validations/loginValidator";
import { otpSchema } from "@shared/validations/otpValidator";
import { registerUserSchema } from "@shared/validations/userRegisterValidator";
import {
  ForbiddenException,
  InvalidDataException,
  InvalidOTPExecption,
  NotFoundExecption,
} from "application/constants/exceptions";
import { NextFunction, Request, Response } from "express";

export class InvestorAuthController {
  constructor(
    private _registerInvestorUseCase: ICreateInvestorUseCase,
    private _sendOtpUseCase: ISignUpSendOtpUseCase,
    private _verifyOtpUseCase: IVerifyOtpUseCase,
    private _investorLoginUseCase: IInvestorLoginUseCase,
    private _tokenCreationUseCase: ITokenCreationUseCase,
    private _cacheInvestorUseCase: ICacheInvestorUseCase,
    private _resendOtpUseCase: IResendOtpUseCase,
    private _forgetPasswordSendOtpUseCase: IForgetPasswordSendOtpUseCaes,
    private _forgetPasswordVerifyOtpUseCase: IForgetPasswordVerifyOtpUseCase,
    private _forgetPasswordResetPasswordUseCase: IForgetPasswordInvestorResetPasswordUseCase,
    private _googleLoginUseCase: IGoogleLoginUseCase,
    private _jwtService: IJWTService,
    private _userRepository: IUserRepository,
    private _investorRepository: IInvestorRepository
  ) {}

  private async getEmailFromDB(userId: string, role: UserRole): Promise<string> {
    if (role === UserRole.INVESTOR) {
      const investor = await this._investorRepository.findById(userId);
      if (!investor?.email) {
        throw new NotFoundExecption(INVESTOR_ERRORS.NO_INVESTORS_FOUND);
      }
      return investor.email;
    }

    const user = await this._userRepository.findById(userId);
    if (!user?.email) {
      throw new NotFoundExecption(USER_ERRORS.USER_NOT_FOUND);
    }
    return user.email;
  }

  async signUpSendOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const investorData = registerUserSchema.safeParse(req.body);
      console.log("investorData", investorData);

      if (investorData.error) {
        const firstIssue = investorData.error.issues[0];

        throw new InvalidDataException(firstIssue?.message || Errors.INVALID_USERDATA);
      }

      await this._sendOtpUseCase.signUpSendOtp(investorData.data);

      ResponseHelper.success(res, MESSAGES.OTP.OTP_SUCCESSFULL, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  async registerInvestor(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedEmail = emailSchema.safeParse(req.body.email);
      const validatedOtp = otpSchema.safeParse(req.body.otp);
      console.log("validatedEmail", validatedEmail);
      console.log("validatedOtp", validatedOtp);

      if (validatedEmail.error) {
        const firstIssue = validatedEmail.error.issues[0];
        throw new InvalidDataException(firstIssue?.message || Errors.INVALID_EMAIL);
      }

      if (validatedOtp.error) {
        const firstIssue = validatedOtp.error.issues[0];
        throw new InvalidOTPExecption(firstIssue?.message || Errors.INVALID_OTP);
      }

      const email = validatedEmail.data;
      const otp = validatedOtp.data;

      const verifiedOtp = await this._verifyOtpUseCase.verifyOtp(email, otp);

      if (!verifiedOtp) {
        throw new InvalidOTPExecption(Errors.INVALID_OTP);
      }

      await this._registerInvestorUseCase.createInvestor(email);

      ResponseHelper.success(res, MESSAGES.INVESTOR.REGISTER_SUCCESS, HTTPSTATUS.CREATED);
    } catch (error) {
      next(error);
    }
  }

  async loginInvestor(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = loginSchema.safeParse(req.body);

      if (data.error) {
        throw new InvalidDataException(data.error.issues[0]?.message || Errors.INVALID_DATA);
      }

      const { email, password } = data.data;

      const investor = await this._investorLoginUseCase.investorLogin(email, password);

      if (!investor) {
        throw new InvalidDataException(Errors.INVALID_CREDENTIALS);
      }

      const token = this._tokenCreationUseCase.createAccessTokenAndRefreshToken({
        userId: investor._id.toString(),
        role: UserRole.INVESTOR,
      });

      setRefreshTokenCookie(res, token.refreshToken);

      await this._cacheInvestorUseCase.cacheInvestor(investor);

      ResponseHelper.success(
        res,
        MESSAGES.USERS.LOGIN_SUCCESS,
        { investor, accessToken: token.accessToken },
        HTTPSTATUS.OK
      );
    } catch (error) {
      next(error);
    }
  }

  async resendOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedEmail = emailSchema.safeParse(req.body.email);

      if (validatedEmail.error) {
        throw new InvalidDataException(
          validatedEmail.error.issues[0]?.message || Errors.INVALID_EMAIL
        );
      }

      await this._resendOtpUseCase.resendOtp(validatedEmail.data);

      ResponseHelper.success(res, MESSAGES.OTP.OTP_SUCCESSFULL, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  async forgetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedEmail = emailSchema.safeParse(req.body.email);
      if (validatedEmail.error) {
        throw new InvalidDataException(
          validatedEmail.error.issues[0]?.message || Errors.INVALID_EMAIL
        );
      }

      await this._forgetPasswordSendOtpUseCase.sendOtp(validatedEmail.data);

      ResponseHelper.success(res, MESSAGES.OTP.RESEND_OTP_SUCCESSFULL, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  async forgetPasswordVerifyOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = forgetPasswordVerifyOtpSchema.safeParse(req.body);

      if (data.error) {
        const firstIssue = data.error.issues[0];

        throw new InvalidDataException(firstIssue?.message || Errors.INVALID_DATA);
      }

      await this._forgetPasswordVerifyOtpUseCase.verify(data.data);

      ResponseHelper.success(res, MESSAGES.OTP.OTP_VERIFIED_SUCCESSFULL, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  async forgetPasswordResetPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data = forgetPasswordResetPasswordSchema.safeParse(req.body);

      if (data.error) {
        const firstIssue = data.error.issues[0];

        throw new InvalidDataException(firstIssue?.message || Errors.INVALID_DATA);
      }

      await this._forgetPasswordResetPasswordUseCase.reset(data.data);

      ResponseHelper.success(res, MESSAGES.USERS.PASSWORD_RESET_SUCCESSFULLY, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  async googleLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const loginData = googleLoginSchema.safeParse(req.body);

      if (loginData.error) {
        throw new InvalidDataException(loginData.error.issues[0]?.message || Errors.INVALID_DATA);
      }

      const responseDTO = await this._googleLoginUseCase.execute(loginData.data);

      const accessToken = await this._jwtService.createAccessToken({
        userId: responseDTO._id,
        role: responseDTO.role,
      });

      const refreshToken = await this._jwtService.createRefreshToken({
        userId: responseDTO._id,
        role: responseDTO.role,
      });

      setRefreshTokenCookie(res, refreshToken);

      ResponseHelper.success(
        res,
        MESSAGES.INVESTOR.LOGIN_SUCCESS,
        {
          investor: responseDTO,
          accessToken: accessToken,
        },
        HTTPSTATUS.OK
      );
    } catch (error) {
      next(error);
    }
  }
  async requestChangePasswordOtp(req: Request, res: Response, next: NextFunction) {
    try {
      if (!res.locals.user) {
        throw new ForbiddenException(Errors.UNAUTHORIZED_ACCESS);
      }
      const { userId, role } = res.locals.user;

      const email = await this.getEmailFromDB(userId, role);

      await this._forgetPasswordSendOtpUseCase.sendOtp(email);

      ResponseHelper.success(res, MESSAGES.OTP.OTP_SUCCESSFULL, null, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  async verifyChangePasswordOtp(req: Request, res: Response, next: NextFunction) {
    try {
      if (!res.locals.user) {
        throw new ForbiddenException(Errors.UNAUTHORIZED_ACCESS);
      }
      const { otp } = req.body;
      const { userId, role } = res.locals.user;

      const validatedOtp = otpSchema.safeParse(otp);

      if (validatedOtp.error) {
        throw new InvalidOTPExecption(validatedOtp.error.issues[0]?.message || Errors.INVALID_OTP);
      }

      const email = await this.getEmailFromDB(userId, role);

      const token = await this._forgetPasswordVerifyOtpUseCase.verify({
        email,
        otp: validatedOtp.data,
      });

      ResponseHelper.success(res, MESSAGES.OTP.OTP_VERIFIED_SUCCESSFULL, { token }, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      if (!res.locals.user) {
        throw new ForbiddenException(Errors.UNAUTHORIZED_ACCESS);
      }
      const { userId, role } = res.locals.user;

      const data = changePasswordSchema.safeParse(req.body);

      if (data.error) {
        throw new InvalidDataException(data.error.issues[0]?.message || Errors.INVALID_DATA);
      }

      const { password, token } = data.data;

      const email = await this.getEmailFromDB(userId, role);
      await this._forgetPasswordResetPasswordUseCase.reset({
        email,
        password,
        token,
      });

      ResponseHelper.success(res, MESSAGES.USERS.PASSWORD_UPDATED_SUCCESS, null, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }
}

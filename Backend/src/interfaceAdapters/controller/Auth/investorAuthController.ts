import { UserRole } from "@domain/enum/userRole";
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
import { Errors } from "@shared/constants/error";
import { HTTPSTATUS } from "@shared/constants/httpStatus";
import { MESSAGES } from "@shared/constants/messages";
import { ResponseHelper } from "@shared/utils/responseHelper";
import { setRefreshTokenCookie } from "@shared/utils/setRefreshTokenCookie";
import { emailSchema } from "@shared/validations/emailValidator";
import { forgetPasswordResetPasswordSchema } from "@shared/validations/forgetPasswordResetPasswordValidator";
import { forgetPasswordVerifyOtpSchema } from "@shared/validations/forgetPasswordVerifyOtpValidator";
import { googleLoginSchema } from "@shared/validations/googleLoginValidator";
import { loginSchema } from "@shared/validations/loginValidator";
import { otpSchema } from "@shared/validations/otpValidator";
import { registerUserSchema } from "@shared/validations/userRegisterValidator";
import { InvalidDataException, InvalidOTPExecption } from "application/constants/exceptions";
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
    private _jwtService: IJWTService
  ) {}

  async signUpSendOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const investorData = registerUserSchema.safeParse(req.body);
      if (investorData.error) {
        throw new InvalidDataException(Errors.INVALID_USERDATA);
      }

      await this._sendOtpUseCase.signUpSendOtp(investorData.data!);

      ResponseHelper.success(res, MESSAGES.OTP.OTP_SUCCESSFULL, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  async registerInvestor(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedEmail = emailSchema.safeParse(req.body.email);
      const validatedOtp = otpSchema.safeParse(req.body.otp);

      if (validatedEmail.error) {
        throw new InvalidDataException(Errors.INVALID_EMAIL);
      }

      const email = validatedEmail.data;
      const otp = validatedOtp.data;

      const verifiedOtp = await this._verifyOtpUseCase.verifyOtp(email, otp!);

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
      const { email, password } = loginSchema.parse(req.body);

      const investor = await this._investorLoginUseCase.investorLogin(email, password);
      console.log("investor Data :", investor);

      const token = this._tokenCreationUseCase.createAccessTokenAndRefreshToken({
        userId: (await investor)._id.toString(),
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
      console.log(validatedEmail.data);
      if (validatedEmail.error) {
        throw new InvalidDataException(Errors.INVALID_EMAIL);
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
        throw new InvalidDataException(Errors.INVALID_EMAIL);
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
        throw new InvalidDataException(Errors.INVALID_DATA);
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
      console.log(data);
      if (data.error) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      await this._forgetPasswordResetPasswordUseCase.reset(data.data);

      ResponseHelper.success(res, MESSAGES.USERS.PASSWORD_RESET_SUCCESSFULLY, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  async googleLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log(req.body);
      const loginData = googleLoginSchema.safeParse(req.body);

      if (loginData.error) {
        throw new InvalidDataException(loginData.error.message);
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
}

import { ISignUpSendOtpUseCase } from "@domain/interfaces/useCases/auth/user/ISignUpSendOtp";
import { IVerifyOtpUseCase } from "@domain/interfaces/useCases/auth/IVerifyOtp";
import { ICreateUserUseCase } from "@domain/interfaces/useCases/auth/user/ICreateUserUseCase";
import { HTTPSTATUS } from "@shared/constants/httpStatus";
import { Errors, INVESTOR_ERRORS, USER_ERRORS } from "@shared/constants/error";
import { NextFunction, Request, Response } from "express";
import { MESSAGES } from "@shared/constants/messages";
import { emailSchema } from "@shared/validations/emailValidator";
import { registerUserSchema } from "@shared/validations/userRegisterValidator";
import { IUserLoginUseCase } from "@domain/interfaces/useCases/auth/user/IUserLoginUseCase";
import { ITokenCreationUseCase } from "@domain/interfaces/useCases/auth/ITokenCreation";
import { ICacheUserUseCase } from "@domain/interfaces/useCases/auth/user/ICacheUserUseCase";
import { loginSchema } from "@shared/validations/loginValidator";
import { UserRole } from "@domain/enum/userRole";
import { setRefreshTokenCookie } from "@shared/utils/setRefreshTokenCookie";
import { otpSchema } from "@shared/validations/otpValidator";
import { IResendOtpUseCase } from "@domain/interfaces/useCases/auth/IResendOtp";
import { IForgetPasswordSendOtpUseCaes } from "@domain/interfaces/useCases/auth/IForgetPasswordSendOtp";
import { forgetPasswordVerifyOtpSchema } from "@shared/validations/forgetPasswordVerifyOtpValidator";
import { IForgetPasswordVerifyOtpUseCase } from "@domain/interfaces/useCases/auth/IForgetPasswordVerifyOtp";
import { forgetPasswordResetPasswordSchema } from "@shared/validations/forgetPasswordResetPasswordValidator";
import { IForgetPasswordResetPasswordUseCase } from "@domain/interfaces/useCases/auth/IForgetPasswordResetPassword";
import { IRefreshTokenUseCase } from "@domain/interfaces/useCases/auth/IRefreshToken";
import { ITokenInvalidationUseCase } from "@domain/interfaces/useCases/auth/ITokenInvalidationUseCase";
import { clearRefreshTokenCookie } from "@shared/utils/clearRefreshTokenCookie";
import { ResponseHelper } from "@shared/utils/responseHelper";
import {
  InvalidDataException,
  InvalidOTPExecption,
  NotFoundExecption,
  TokenExpiredException,
} from "application/constants/exceptions";
import { googleLoginSchema } from "@shared/validations/googleLoginValidator";
import { IJWTService } from "@domain/interfaces/services/IJWTService";
import { IGoogleLoginUseCase } from "@domain/interfaces/useCases/auth/IGoogleLoginUseCase";
import { IGetProfileImg } from "@domain/interfaces/useCases/auth/IGetProfileImg";
import { IInterestedTopicsUseCase } from "@domain/interfaces/useCases/auth/IInterestedTopicsUseCase";
import { IInvestorRepository } from "@domain/interfaces/repositories/IInvestorRespository";
import { IUserRepository } from "@domain/interfaces/repositories/IUserRepository";

export class UserAuthController {
  constructor(
    private _registerUserUseCase: ICreateUserUseCase,
    private _sendOtpUseCase: ISignUpSendOtpUseCase,
    private _verifyOtpUseCase: IVerifyOtpUseCase,
    private _userLoginUseCase: IUserLoginUseCase,
    private _tokenCreationUseCase: ITokenCreationUseCase,
    private _cacheUserUseCase: ICacheUserUseCase,
    private _resendOtpUseCase: IResendOtpUseCase,
    private _forgetPasswordSendOtpUseCase: IForgetPasswordSendOtpUseCaes,
    private _forgetPasswordVerifyOtpUseCase: IForgetPasswordVerifyOtpUseCase,
    private _forgetPasswordResetPasswordUseCase: IForgetPasswordResetPasswordUseCase,
    private _tokenRefreshUseCase: IRefreshTokenUseCase,
    private _tokenInvalidationUseCase: ITokenInvalidationUseCase,
    private _jwtService: IJWTService,
    private _googleLoginUseCase: IGoogleLoginUseCase,
    private _getProfileImgUseCase: IGetProfileImg,
    private _interestedTopics: IInterestedTopicsUseCase,
    private _investorRepository: IInvestorRepository,
    private _userRepository: IUserRepository
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
      const userData = registerUserSchema.safeParse(req.body);
      if (userData.error) {
        throw new InvalidDataException(Errors.INVALID_USERDATA);
      }

      await this._sendOtpUseCase.signUpSendOtp(userData.data!);

      ResponseHelper.success(res, MESSAGES.OTP.OTP_SUCCESSFULL, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  async registerUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedEmail = emailSchema.safeParse(req.body.email);
      const validatedOtp = otpSchema.safeParse(req.body.otp);

      if (validatedEmail.error) {
        throw new InvalidDataException(Errors.INVALID_EMAIL);
      }

      if (validatedOtp.error) {
        throw new InvalidOTPExecption(Errors.OTP_ERROR);
      }

      const otp = validatedOtp.data;
      const email = validatedEmail.data;

      console.log(`Entered OTP : ${otp} AND EMAIL : ${email}`);

      const verifiedOtp = await this._verifyOtpUseCase.verifyOtp(email, otp!);
      console.log("verifiedOtp", verifiedOtp);

      if (!verifiedOtp) {
        throw new InvalidOTPExecption(Errors.INVALID_OTP);
      }

      await this._registerUserUseCase.createUser(email);

      ResponseHelper.success(res, MESSAGES.USERS.REGISTER_SUCCESS, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  async loginUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = loginSchema.parse(req.body);

      const user = await this._userLoginUseCase.userLogin(email, password);

      if (!user) {
        throw new InvalidDataException(Errors.INVALID_CREDENTIALS);
      }

      const token = this._tokenCreationUseCase.createAccessTokenAndRefreshToken({
        userId: user._id.toString(),
        role: UserRole.USER,
      });

      setRefreshTokenCookie(res, token.refreshToken);

      await this._cacheUserUseCase.cacheUser(user);
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

  async resendOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedEmail = emailSchema.safeParse(req.body.email);
      console.log(validatedEmail.data);

      if (validatedEmail.error) {
        throw new InvalidDataException(Errors.INVALID_EMAIL);
      }

      await this._resendOtpUseCase.resendOtp(validatedEmail.data);

      ResponseHelper.success(res, MESSAGES.OTP.RESEND_OTP_SUCCESSFULL, HTTPSTATUS.OK);
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

      await this._forgetPasswordSendOtpUseCase.sendOtp(validatedEmail.data!);

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

      const token = await this._forgetPasswordVerifyOtpUseCase.verify(data.data!);

      ResponseHelper.success(res, MESSAGES.OTP.OTP_VERIFIED_SUCCESSFULL, token, HTTPSTATUS.OK);
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
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      await this._forgetPasswordResetPasswordUseCase.reset(data.data!);

      ResponseHelper.success(res, MESSAGES.USERS.PASSWORD_RESET_SUCCESSFULLY, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  async handleTokenRefresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const refreshToken = req.cookies.RefreshToken;
      const accessToken = await this._tokenRefreshUseCase.refresh(refreshToken);

      if (!accessToken) {
        throw new TokenExpiredException(Errors.ERROR_CREATING_ACCESS_TOKEN);
      }

      ResponseHelper.success(
        res,
        MESSAGES.REFRESH_TOKEN.REFRESH_SUCCESSFUL,
        accessToken,
        HTTPSTATUS.OK
      );
    } catch (error) {
      next(error);
    }
  }

  async handleLogout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const refreshToken = req.cookies.RefreshToken;
      console.log(refreshToken);
      console.log(req.cookies);

      await this._tokenInvalidationUseCase.refreshToken(refreshToken);

      clearRefreshTokenCookie(res);

      ResponseHelper.success(res, MESSAGES.USERS.LOGOUT_SUCCESS, HTTPSTATUS.OK);
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
        MESSAGES.USERS.LOGIN_SUCCESS,
        { user: responseDTO, accessToken: accessToken },
        HTTPSTATUS.OK
      );
    } catch (error) {
      next(error);
    }
  }

  async handleProfileImg(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      const profileImg = await this._getProfileImgUseCase.getProfile(id);
      console.log(profileImg);
      ResponseHelper.success(res, MESSAGES.USERS.PROFILE_IMG_SUCCESS, profileImg, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  async handleInterestedTopics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id, interestedTopics } = req.body;
      console.log("data from frontend : : : ,", id, interestedTopics);

      await this._interestedTopics.setTopics(id, interestedTopics);

      ResponseHelper.success(res, MESSAGES.USERS.INTERESTED_TOPICS_SET_SUCCESSFULL, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  async requestChangePasswordOtp(req: Request, res: Response, next: NextFunction) {
    try {
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
      const { otp } = req.body;
      const { userId, role } = res.locals.user;

      const email = await this.getEmailFromDB(userId, role);

      const token = await this._forgetPasswordVerifyOtpUseCase.verify({
        email,
        otp,
      });

      ResponseHelper.success(res, MESSAGES.OTP.OTP_VERIFIED_SUCCESSFULL, { token }, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { password, token } = req.body;
      const { userId, role } = res.locals.user;

      const email = await this.getEmailFromDB(userId, role);
      console.log("password : ", password);
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

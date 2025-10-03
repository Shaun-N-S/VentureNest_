import { ISignUpSendOtpUseCase } from "@domain/interfaces/useCases/auth/user/ISignUpSendOtp";
import { IVerifyOtpUseCase } from "@domain/interfaces/useCases/auth/IVerifyOtp";
import { ICreateUserUseCase } from "@domain/interfaces/useCases/auth/user/ICreateUserUseCase";
import { HTTPStatus } from "@shared/constants/httpStatus";
import { Errors } from "@shared/constants/error";
import { Request, Response } from "express";
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
import { IKeyValueTTLCaching } from "@domain/interfaces/services/ICache/IKeyValueTTLCaching";
import { IResendOtpUseCase } from "@domain/interfaces/useCases/auth/IResendOtp";
import { IForgetPasswordSendOtpUseCaes } from "@domain/interfaces/useCases/auth/IForgetPasswordSendOtp";
import { forgetPasswordVerifyOtpSchema } from "@shared/validations/forgetPasswordVerifyOtpValidator";
import { IForgetPasswordVerifyOtpUseCase } from "@domain/interfaces/useCases/auth/IForgetPasswordVerifyOtp";
import { forgetPasswordResetPasswordSchema } from "@shared/validations/forgetPasswordResetPasswordValidator";
import { IForgetPasswordResetPasswordUseCase } from "@domain/interfaces/useCases/auth/IForgetPasswordResetPassword";

export class UserAuthController {
  constructor(
    private _registerUserUseCase: ICreateUserUseCase,
    private _sendOtpUseCase: ISignUpSendOtpUseCase,
    private _verifyOtpUseCase: IVerifyOtpUseCase,
    private _userLoginUseCase: IUserLoginUseCase,
    private _tokenCreationUseCase: ITokenCreationUseCase,
    private _cacheUserUseCase: ICacheUserUseCase,
    private _cacheStorage: IKeyValueTTLCaching,
    private _resendOptUseCase: IResendOtpUseCase,
    private _forgetPasswordSendOtpUseCase: IForgetPasswordSendOtpUseCaes,
    private _forgetPasswordVerifyOtpUseCase: IForgetPasswordVerifyOtpUseCase,
    private _forgetPasswordResetPasswordUseCase: IForgetPasswordResetPasswordUseCase
  ) {}

  async signUpSendOtp(req: Request, res: Response): Promise<void> {
    try {
      // const validatedEmail = emailSchema.safeParse(req.body.email);
      const userData = registerUserSchema.safeParse(req.body);
      if (userData.error) {
        throw new Error(Errors.INVALID_USERDATA);
      }

      await this._sendOtpUseCase.signUpSendOtp(userData.data!);

      res.status(HTTPStatus.OK).json({ message: MESSAGES.OTP.OTP_SUCCESSFULL });
    } catch (error) {
      console.log(error);
      res.status(HTTPStatus.BAD_REQUEST).json({ messsage: Errors.OTP_ERROR, error });
    }
  }

  async registerUser(req: Request, res: Response): Promise<void> {
    try {
      const validatedEmail = emailSchema.safeParse(req.body.email);
      const validatedOtp = otpSchema.safeParse(req.body.otp);
      console.log("email : ", validatedEmail.data);
      if (validatedEmail.error) {
        res.status(HTTPStatus.BAD_REQUEST).json({ message: Errors.INVALID_EMAIL });
        return;
      }

      if (validatedOtp.error) {
        res.status(HTTPStatus.BAD_REQUEST).json({ message: Errors.OTP_ERROR });
        return;
      }

      const otp = validatedOtp.data;
      const email = validatedEmail.data;
      console.log("otp", otp);
      console.log("email ", email);

      const verifiedOtp = await this._verifyOtpUseCase.verifyOtp(email, otp!);
      console.log("verifiedOtp", verifiedOtp);
      if (!verifiedOtp) {
        res.status(HTTPStatus.BAD_REQUEST).json({ message: Errors.OTP_VERIFICATION_FAILED });
        return;
      }

      const user = await this._registerUserUseCase.createUser(email);
      console.log("user after creating : ", user);

      res.status(HTTPStatus.OK).json({ success: true, data: user });
    } catch (error) {
      res
        .status(HTTPStatus.BAD_REQUEST)
        .json({ success: false, message: error instanceof Error ? error.message : "Server Error" });
    }
  }

  async loginUser(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = loginSchema.parse(req.body);

      const user = await this._userLoginUseCase.userLogin(email, password);
      console.log(user);

      const token = this._tokenCreationUseCase.createAccessTokenAndRefreshToken({
        userId: user._id.toString(),
        role: UserRole.USER,
      });

      setRefreshTokenCookie(res, token.refreshToken);

      await this._cacheUserUseCase.cacheUser(user);

      res.status(HTTPStatus.OK).json({
        success: true,
        message: "Login successfull",
        data: { user, accessToken: token.accessToken },
      });
    } catch (error) {
      res.status(HTTPStatus.BAD_REQUEST).json({
        message: Errors.INVALID_CREDENTIALS,
        error: error instanceof Error ? error.message : "Error while validating user",
      });
    }
  }

  async resendOtp(req: Request, res: Response): Promise<void> {
    try {
      const validatedEmail = emailSchema.safeParse(req.body.email);
      console.log(validatedEmail.data);
      if (validatedEmail.error) {
        throw new Error(Errors.INVALID_EMAIL);
      }
      console.log("reached...");
      await this._resendOptUseCase.resendOtp(validatedEmail.data);

      res.status(HTTPStatus.OK).json({ message: MESSAGES.OTP.OTP_SUCCESSFULL });
    } catch (error) {
      console.log(`Error while sending otp : ${error}`);
      res.status(HTTPStatus.BAD_REQUEST).json({ message: "Error while resending otp" });
    }
  }

  async forgetPassword(req: Request, res: Response): Promise<void> {
    try {
      const validatedEmail = emailSchema.safeParse(req.body.email);
      if (validatedEmail.error) {
        throw new Error(Errors.INVALID_EMAIL);
      }

      await this._forgetPasswordSendOtpUseCase.sendOtp(validatedEmail.data);

      res.status(HTTPStatus.OK).json({ message: MESSAGES.OTP.RESEND_OTP_SUCCESSFULL });
    } catch (error) {
      res.status(HTTPStatus.BAD_REQUEST).json({
        message: "Error while sending forget password otp",
      });
    }
  }

  async forgetPasswordVerifyOtp(req: Request, res: Response): Promise<void> {
    try {
      const data = forgetPasswordVerifyOtpSchema.safeParse(req.body);

      if (data.error) {
        throw new Error(Errors.INVALID_DATA);
      }

      const token = await this._forgetPasswordVerifyOtpUseCase.verify(data.data);

      res.status(HTTPStatus.OK).json({ message: MESSAGES.OTP.OTP_VERIFIED_SUCCESSFULL, token });
    } catch (error) {
      res.status(HTTPStatus.BAD_REQUEST).json({ message: Errors.OTP_VERIFICATION_FAILED });
    }
  }

  async forgetPasswordResetPassword(req: Request, res: Response): Promise<void> {
    try {
      const data = forgetPasswordResetPasswordSchema.safeParse(req.body);

      if (data.error) {
        throw new Error(Errors.INVALID_DATA);
      }

      await this._forgetPasswordResetPasswordUseCase.reset(data.data);

      res.status(HTTPStatus.OK).json({ message: MESSAGES.USERS.PASSWORD_RESET_SUCCESSFULLY });
    } catch (error) {
      res.status(HTTPStatus.BAD_REQUEST).json({ message: "Error while reseting new password" });
    }
  }
}

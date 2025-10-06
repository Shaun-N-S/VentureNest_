import { UserRole } from "@domain/enum/userRole";
import { IForgetPasswordResetPasswordUseCase } from "@domain/interfaces/useCases/auth/IForgetPasswordResetPassword";
import { IForgetPasswordSendOtpUseCaes } from "@domain/interfaces/useCases/auth/IForgetPasswordSendOtp";
import { IForgetPasswordVerifyOtpUseCase } from "@domain/interfaces/useCases/auth/IForgetPasswordVerifyOtp";
import { ICacheInvestorUseCase } from "@domain/interfaces/useCases/auth/investor/ICacheInvestorUseCase";
import { ICreateInvestorUseCase } from "@domain/interfaces/useCases/auth/investor/ICreateInvestorUseCase";
import { IInvestorLoginUseCase } from "@domain/interfaces/useCases/auth/investor/IInvestorLoginUseCase";
import { IResendOtpUseCase } from "@domain/interfaces/useCases/auth/IResendOtp";
import { ITokenCreationUseCase } from "@domain/interfaces/useCases/auth/ITokenCreation";
import { IVerifyOtpUseCase } from "@domain/interfaces/useCases/auth/IVerifyOtp";
import { ISignUpSendOtpUseCase } from "@domain/interfaces/useCases/auth/user/ISignUpSendOtp";
import { Errors } from "@shared/constants/error";
import { HTTPStatus } from "@shared/constants/httpStatus";
import { MESSAGES } from "@shared/constants/messages";
import { setRefreshTokenCookie } from "@shared/utils/setRefreshTokenCookie";
import { emailSchema } from "@shared/validations/emailValidator";
import { forgetPasswordResetPasswordSchema } from "@shared/validations/forgetPasswordResetPasswordValidator";
import { forgetPasswordVerifyOtpSchema } from "@shared/validations/forgetPasswordVerifyOtpValidator";
import { loginSchema } from "@shared/validations/loginValidator";
import { otpSchema } from "@shared/validations/otpValidator";
import { registerUserSchema } from "@shared/validations/userRegisterValidator";
import { Request, Response } from "express";

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
    private _forgetPasswordResetPasswordUseCase: IForgetPasswordResetPasswordUseCase
  ) {}

  async signUpSendOtp(req: Request, res: Response): Promise<void> {
    try {
      const investorData = registerUserSchema.safeParse(req.body);
      if (investorData.error) {
        throw new Error(Errors.INVALID_USERDATA);
      }

      await this._sendOtpUseCase.signUpSendOtp(investorData.data!);

      res.status(HTTPStatus.OK).json({ message: MESSAGES.OTP.OTP_SUCCESSFULL });
    } catch (error) {
      console.log(` error while sending otp : ${error}`);
      res.status(HTTPStatus.BAD_REQUEST).json({ message: Errors.OTP_ERROR });
    }
  }

  async registerInvestor(req: Request, res: Response): Promise<void> {
    try {
      const validatedEmail = emailSchema.safeParse(req.body.email);
      const validatedOtp = otpSchema.safeParse(req.body.otp);

      if (validatedEmail.error) {
        res.status(HTTPStatus.BAD_REQUEST).json({ message: Errors.INVALID_EMAIL });
        return;
      }

      const email = validatedEmail.data;
      const otp = validatedOtp.data;

      const verifiedOtp = await this._verifyOtpUseCase.verifyOtp(email, otp!);

      if (!verifiedOtp) {
        res.status(HTTPStatus.BAD_REQUEST).json({ message: Errors.OTP_VERIFICATION_FAILED });
        return;
      }

      await this._registerInvestorUseCase.createInvestor(email);

      res
        .status(HTTPStatus.OK)
        .json({ success: true, message: MESSAGES.INVESTOR.REGISTER_SUCCESS });
    } catch (error) {
      res
        .status(HTTPStatus.BAD_REQUEST)
        .json({ success: false, message: error instanceof Error ? error.message : "Server Error" });
    }
  }

  async loginInvestor(req: Request, res: Response): Promise<void> {
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

      res.status(HTTPStatus.OK).json({
        success: true,
        message: "Login successfull",
        data: { investor, accessToken: token.accessToken },
      });
    } catch (error) {
      res.status(HTTPStatus.BAD_REQUEST).json({
        message: Errors.INVALID_CREDENTIALS,
        error: error instanceof Error ? error.message : "Error while validating investor",
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
      await this._resendOtpUseCase.resendOtp(validatedEmail.data);

      res.status(HTTPStatus.OK).json({ message: MESSAGES.OTP.OTP_SUCCESSFULL });
    } catch (error) {
      console.log(`Error while sending otp : ${error}`);
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

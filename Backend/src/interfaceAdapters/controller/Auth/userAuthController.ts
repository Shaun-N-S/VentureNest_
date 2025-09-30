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

export class UserAuthController {
  constructor(
    private _registerUseCase: ICreateUserUseCase,
    private _sendOtpUseCase: ISignUpSendOtpUseCase,
    private _verifyOtpUseCase: IVerifyOtpUseCase,
    private _userLoginUseCase: IUserLoginUseCase,
    private _tokenCreationUseCase: ITokenCreationUseCase,
    private _cacheUserUseCase: ICacheUserUseCase
  ) {}

  async signUpSendOtp(req: Request, res: Response): Promise<void> {
    try {
      const validatedEmail = emailSchema.safeParse(req.body.email);
      if (!validatedEmail) {
        throw new Error(Errors.INVALID_EMAIL);
      }

      console.log("reached here !!");
      await this._sendOtpUseCase.signUpSendOtp(validatedEmail.data!);

      res.status(HTTPStatus.OK).json({ message: MESSAGES.OTP.OTP_SUCCESSFULL });
    } catch (error) {
      console.log(error);
      res.status(HTTPStatus.BAD_REQUEST).json({ messsage: Errors.OTP_ERROR, error });
    }
  }

  async registerUser(req: Request, res: Response): Promise<void> {
    try {
      const userData = registerUserSchema.safeParse(req.body);
      console.log("userdata : ", userData);
      if (!userData.success) {
        res.status(HTTPStatus.BAD_REQUEST).json({ message: Errors.INVALID_USERDATA });
        return;
      }

      const { otp, email, userName, password } = userData.data!;
      console.log("otp", otp);

      const verifiedOtp = await this._verifyOtpUseCase.verifyOtp(email, otp);

      if (!verifiedOtp) {
        res.status(HTTPStatus.BAD_REQUEST).json({ message: Errors.OTP_VERIFICATION_FAILED });
        return;
      }

      const user = await this._registerUseCase.createUser({ userName, email, password });
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
      console.log(email, password);

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
}

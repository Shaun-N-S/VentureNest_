import { ISendOtpUseCase } from "@domain/interfaces/useCases/auth/ISendOtp";
import { IVerifyOtpUseCase } from "@domain/interfaces/useCases/auth/IVerifyOtp";
import { ICreateUserUseCase } from "@domain/interfaces/useCases/user/auth/ICreateUserUseCase";
import { HTTPStatus } from "@shared/constants/httpStatus";
import { Errors } from "@shared/constants/error";
import { Request, Response } from "express";
import { MESSAGES } from "@shared/constants/messages";
import { emailSchema } from "@shared/validations/emailValidator";
import { IKeyValueTTLCaching } from "@domain/interfaces/services/ICache/IKeyValueTTLCaching";
import { registerUserSchema } from "@shared/validations/userRegisterValidator";
import { success } from "zod";

export class UserAuthController {
  constructor(
    private _registerUseCase: ICreateUserUseCase,
    private _sendOtpUseCase: ISendOtpUseCase,
    private _verifyOtpUseCase: IVerifyOtpUseCase
    // private _cacheUserUseCase: ICache,
  ) {}

  async sendOtp(req: Request, res: Response): Promise<void> {
    try {
      const validatedEmail = emailSchema.safeParse(req.body.email);
      if (!validatedEmail) {
        throw new Error(Errors.INVALID_EMAIL);
      }

      await this._sendOtpUseCase.sendOtp(validatedEmail.data!);

      res.status(HTTPStatus.OK).json({ message: MESSAGES.OTP.OTP_SUCCESSFULL });
    } catch (error) {
      res.status(HTTPStatus.BAD_REQUEST).json({ messsage: Errors.OTP_ERROR });
    }
  }

  async registerUser(req: Request, res: Response): Promise<void> {
    try {
      const userData = registerUserSchema.safeParse(req.body);
      if (!userData.success) {
        res.status(HTTPStatus.BAD_REQUEST).json({ message: Errors.INVALID_USERDATA });
        return;
      }

      const { otp, email, userName, password } = userData.data!;
      console.log("otp", otp);

      const verifiedOtp = await this._verifyOtpUseCase.verifyOtp(email, otp);
      console.log("otp verified or not : ", verifiedOtp);

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
}

import { userAuthController } from "@infrastructure/DI/Auth/authContainer";
import { ROUTES } from "@shared/constants/routes";
import { Request, Response, Router } from "express";

export class User_Router {
  private _route: Router;

  constructor() {
    this._route = Router();
    this._setRoute();
  }

  private _setRoute() {
    const USER = ROUTES.AUTH.USER;

    this._route.post(USER.BASE, (req: Request, res: Response) =>
      userAuthController.signUpSendOtp(req, res)
    );

    this._route.post(USER.VERIFY_OTP, (req: Request, res: Response) =>
      userAuthController.registerUser(req, res)
    );

    this._route.post(USER.RESEND_OTP, (req: Request, res: Response) =>
      userAuthController.resendOtp(req, res)
    );

    this._route.post(USER.LOGIN, (req: Request, res: Response) =>
      userAuthController.loginUser(req, res)
    );

    this._route.post(USER.FORGET_PASSWORD.REQUEST, (req: Request, res: Response) =>
      userAuthController.forgetPassword(req, res)
    );

    this._route.post(USER.FORGET_PASSWORD.VERIFY_OTP, (req: Request, res: Response) =>
      userAuthController.forgetPasswordVerifyOtp(req, res)
    );

    this._route.post(USER.FORGET_PASSWORD.RESET_PASSWORD, (req: Request, res: Response) =>
      userAuthController.forgetPasswordResetPassword(req, res)
    );
  }

  public get_router(): Router {
    return this._route;
  }
}

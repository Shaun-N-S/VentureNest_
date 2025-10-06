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
    this._route.post(ROUTES.AUTH.USER.BASE, (req: Request, res: Response) => {
      userAuthController.signUpSendOtp(req, res);
    });

    this._route.post(ROUTES.AUTH.USER.VERIFY_OTP, (req: Request, res: Response) => {
      userAuthController.registerUser(req, res);
    });

    this._route.post(ROUTES.AUTH.USER.RESEND_OTP, (req: Request, res: Response) => {
      userAuthController.resendOtp(req, res);
    });

    this._route.post(ROUTES.AUTH.USER.LOGIN, (req: Request, res: Response) => {
      userAuthController.loginUser(req, res);
    });

    this._route.post(ROUTES.AUTH.USER.FORGET_PASSWORD.REQUEST, (req: Request, res: Response) => {
      userAuthController.forgetPassword(req, res);
    });

    this._route.post(ROUTES.AUTH.USER.FORGET_PASSWORD.VERIFY_OTP, (req: Request, res: Response) => {
      userAuthController.forgetPasswordVerifyOtp(req, res);
    });

    this._route.post(
      ROUTES.AUTH.USER.FORGET_PASSWORD.RESET_PASSWORD,
      (req: Request, res: Response) => {
        userAuthController.forgetPasswordResetPassword(req, res);
      }
    );
  }

  public get_router(): Router {
    return this._route;
  }
}

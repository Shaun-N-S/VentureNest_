import { investorAuthController } from "@infrastructure/DI/Auth/authContainer";
import { ROUTES } from "@shared/constants/routes";
import { Request, Response, Router } from "express";

export class Investor_Router {
  private _route: Router;

  constructor() {
    this._route = Router();
    this._setRoute();
  }

  private _setRoute() {
    const INVESTOR = ROUTES.AUTH.INVESTOR;

    this._route.post(INVESTOR.BASE, (req: Request, res: Response) =>
      investorAuthController.signUpSendOtp(req, res)
    );

    this._route.post(INVESTOR.VERIFY_OTP, (req: Request, res: Response) =>
      investorAuthController.registerInvestor(req, res)
    );

    this._route.post(INVESTOR.RESEND_OTP, (req: Request, res: Response) =>
      investorAuthController.resendOtp(req, res)
    );

    this._route.post(INVESTOR.LOGIN, (req: Request, res: Response) =>
      investorAuthController.loginInvestor(req, res)
    );

    this._route.post(INVESTOR.FORGET_PASSWORD.REQUEST, (req: Request, res: Response) =>
      investorAuthController.forgetPassword(req, res)
    );

    this._route.post(INVESTOR.FORGET_PASSWORD.VERIFY_OTP, (req: Request, res: Response) =>
      investorAuthController.forgetPasswordVerifyOtp(req, res)
    );

    this._route.post(INVESTOR.FORGET_PASSWORD.RESET_PASSWORD, (req: Request, res: Response) =>
      investorAuthController.forgetPasswordResetPassword(req, res)
    );
  }

  public get_router(): Router {
    return this._route;
  }
}

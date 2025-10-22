import { investorAuthController } from "@infrastructure/DI/Auth/authContainer";
import { investorProfileController } from "@infrastructure/DI/Investor/InvestorProfileContainer";
import { ROUTES } from "@shared/constants/routes";
import { NextFunction, Request, Response, Router } from "express";

export class Investor_Router {
  private _route: Router;

  constructor() {
    this._route = Router();
    this._setRoute();
  }

  private _setRoute() {
    const INVESTOR = ROUTES.AUTH.INVESTOR;

    this._route.post(INVESTOR.BASE, (req: Request, res: Response, next: NextFunction) =>
      investorAuthController.signUpSendOtp(req, res, next)
    );

    this._route.post(INVESTOR.VERIFY_OTP, (req: Request, res: Response, next: NextFunction) =>
      investorAuthController.registerInvestor(req, res, next)
    );

    this._route.post(INVESTOR.RESEND_OTP, (req: Request, res: Response, next: NextFunction) =>
      investorAuthController.resendOtp(req, res, next)
    );

    this._route.post(INVESTOR.LOGIN, (req: Request, res: Response, next: NextFunction) =>
      investorAuthController.loginInvestor(req, res, next)
    );

    this._route.post(
      INVESTOR.FORGET_PASSWORD.REQUEST,
      (req: Request, res: Response, next: NextFunction) =>
        investorAuthController.forgetPassword(req, res, next)
    );

    this._route.post(
      INVESTOR.FORGET_PASSWORD.VERIFY_OTP,
      (req: Request, res: Response, next: NextFunction) =>
        investorAuthController.forgetPasswordVerifyOtp(req, res, next)
    );

    this._route.post(
      INVESTOR.FORGET_PASSWORD.RESET_PASSWORD,
      (req: Request, res: Response, next: NextFunction) =>
        investorAuthController.forgetPasswordResetPassword(req, res, next)
    );

    this._route.post(
      "/investor/profile-completion",
      (req: Request, res: Response, next: NextFunction) => {
        investorProfileController.profileCompletion(req, res, next);
      }
    );
  }

  public get_router(): Router {
    return this._route;
  }
}

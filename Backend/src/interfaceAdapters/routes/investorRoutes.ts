import { investorAuthController } from "@infrastructure/DI/Auth/authContainer";
import { Request, Response, Router } from "express";

export class Investor_Router {
  private _route: Router;

  constructor() {
    this._route = Router();
    this._setRoute();
  }

  private _setRoute() {
    this._route.post("/investors", (req: Request, res: Response) => {
      investorAuthController.signUpSendOtp(req, res);
    });

    this._route.post("/investors/verify-otp", (req: Request, res: Response) => {
      investorAuthController.registerInvestor(req, res);
    });

    this._route.post("/investors/resend-otp", (req: Request, res: Response) => {
      investorAuthController.resendOtp(req, res);
    });

    this._route.post("/investors/login", (req: Request, res: Response) => {
      investorAuthController.loginInvestor(req, res);
    });
  }

  public get_router(): Router {
    return this._route;
  }
}

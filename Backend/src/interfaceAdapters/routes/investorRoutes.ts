import { investorAuthController, userAuthController } from "@infrastructure/DI/Auth/authContainer";
import { investorProfileController } from "@infrastructure/DI/Investor/InvestorProfileContainer";
import { ROUTES } from "@shared/constants/routes";
import { NextFunction, Request, Response, Router } from "express";
import { investorGuard, userOrInvestorGuard } from "interfaceAdapters/middleware/guards";
import { uploadMulter } from "interfaceAdapters/middleware/multer";

export class Investor_Router {
  private _route: Router;

  constructor() {
    this._route = Router();
    this._setRoute();
  }

  private _setRoute() {
    //investor authentication routes
    const INVESTOR_AUTH = ROUTES.AUTH.INVESTOR;

    this._route.post(INVESTOR_AUTH.BASE, (req: Request, res: Response, next: NextFunction) =>
      investorAuthController.signUpSendOtp(req, res, next)
    );

    this._route.post(INVESTOR_AUTH.VERIFY_OTP, (req: Request, res: Response, next: NextFunction) =>
      investorAuthController.registerInvestor(req, res, next)
    );

    this._route.post(INVESTOR_AUTH.RESEND_OTP, (req: Request, res: Response, next: NextFunction) =>
      investorAuthController.resendOtp(req, res, next)
    );

    this._route.post(INVESTOR_AUTH.LOGIN, (req: Request, res: Response, next: NextFunction) =>
      investorAuthController.loginInvestor(req, res, next)
    );

    this._route.post(
      INVESTOR_AUTH.FORGET_PASSWORD.REQUEST,
      (req: Request, res: Response, next: NextFunction) =>
        investorAuthController.forgetPassword(req, res, next)
    );

    this._route.post(
      INVESTOR_AUTH.FORGET_PASSWORD.VERIFY_OTP,
      (req: Request, res: Response, next: NextFunction) =>
        investorAuthController.forgetPasswordVerifyOtp(req, res, next)
    );

    this._route.post(
      INVESTOR_AUTH.FORGET_PASSWORD.RESET_PASSWORD,
      (req: Request, res: Response, next: NextFunction) =>
        investorAuthController.forgetPasswordResetPassword(req, res, next)
    );

    this._route.post(
      INVESTOR_AUTH.GOOGLE_LOGIN,
      (req: Request, res: Response, next: NextFunction) => {
        investorAuthController.googleLogin(req, res, next);
      }
    );

    //investor profile setup routes

    this._route.post(
      ROUTES.INVESTORS.PROFILE.COMPLETION,
      ...investorGuard,
      uploadMulter.fields([
        { name: "profileImg", maxCount: 1 },
        { name: "portfolioPdf", maxCount: 1 },
      ]),
      (req: Request, res: Response, next: NextFunction) => {
        investorProfileController.profileCompletion(req, res, next);
      }
    );

    this._route.get(
      ROUTES.INVESTORS.PROFILE.FETCH_DATA,
      ...userOrInvestorGuard,
      (req: Request, res: Response, next: NextFunction) => {
        investorProfileController.getProfileData(req, res, next);
      }
    );

    this._route.patch(
      ROUTES.INVESTORS.PROFILE.UPDATE,
      ...investorGuard,
      uploadMulter.fields([{ name: "profileImg", maxCount: 1 }]),
      (req: Request, res: Response, next: NextFunction) => {
        investorProfileController.updateProfileData(req, res, next);
      }
    );

    this._route.patch(
      ROUTES.KYC.UPDATE,
      // ...investorGuard,
      uploadMulter.fields([
        { name: "aadharImg", maxCount: 1 },
        { name: "selfieImg", maxCount: 1 },
      ]),
      (req: Request, res: Response, next: NextFunction) => {
        investorProfileController.updateKYC(req, res, next);
      }
    );

    this._route.post(
      INVESTOR_AUTH.CHANGE_PASSWORD.REQUEST_OTP,
      ...userOrInvestorGuard,
      (req: Request, res: Response, next: NextFunction) =>
        investorAuthController.requestChangePasswordOtp(req, res, next)
    );

    this._route.post(
      INVESTOR_AUTH.CHANGE_PASSWORD.VERIFY_OTP,
      ...userOrInvestorGuard,
      (req: Request, res: Response, next: NextFunction) =>
        investorAuthController.verifyChangePasswordOtp(req, res, next)
    );

    this._route.post(
      INVESTOR_AUTH.CHANGE_PASSWORD.RESET,
      ...userOrInvestorGuard,
      (req: Request, res: Response, next: NextFunction) =>
        investorAuthController.changePassword(req, res, next)
    );
  }

  public get_router(): Router {
    return this._route;
  }
}

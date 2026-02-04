import { userAuthController } from "@infrastructure/DI/Auth/authContainer";
import { userProfileController } from "@infrastructure/DI/User/UserProfileContainer";
import { ROUTES } from "@shared/constants/routes";
import { NextFunction, Request, Response, Router } from "express";
import { userGuard, userOrInvestorGuard } from "interfaceAdapters/middleware/guards";
import { uploadMulter } from "interfaceAdapters/middleware/multer";

export class User_Router {
  private _route: Router;

  constructor() {
    this._route = Router();
    this._setRoute();
  }

  private _setRoute() {
    const USER_AUTH = ROUTES.AUTH.USER;

    this._route.post(USER_AUTH.BASE, (req: Request, res: Response, next: NextFunction) =>
      userAuthController.signUpSendOtp(req, res, next)
    );

    this._route.post(USER_AUTH.VERIFY_OTP, (req: Request, res: Response, next: NextFunction) =>
      userAuthController.registerUser(req, res, next)
    );

    this._route.post(USER_AUTH.RESEND_OTP, (req: Request, res: Response, next: NextFunction) =>
      userAuthController.resendOtp(req, res, next)
    );

    this._route.post(USER_AUTH.LOGIN, (req: Request, res: Response, next: NextFunction) =>
      userAuthController.loginUser(req, res, next)
    );

    this._route.post(
      USER_AUTH.FORGET_PASSWORD.REQUEST,
      (req: Request, res: Response, next: NextFunction) =>
        userAuthController.forgetPassword(req, res, next)
    );

    this._route.post(
      USER_AUTH.FORGET_PASSWORD.VERIFY_OTP,
      (req: Request, res: Response, next: NextFunction) =>
        userAuthController.forgetPasswordVerifyOtp(req, res, next)
    );

    this._route.post(
      USER_AUTH.FORGET_PASSWORD.RESET_PASSWORD,
      (req: Request, res: Response, next: NextFunction) =>
        userAuthController.forgetPasswordResetPassword(req, res, next)
    );

    this._route.post(USER_AUTH.LOGOUT, (req: Request, res: Response, next: NextFunction) => {
      userAuthController.handleLogout(req, res, next);
    });

    this._route.post(USER_AUTH.REFRESH, (req: Request, res: Response, next: NextFunction) => {
      userAuthController.handleTokenRefresh(req, res, next);
    });

    this._route.post(USER_AUTH.GOOGLE_LOGIN, (req: Request, res: Response, next: NextFunction) => {
      userAuthController.googleLogin(req, res, next);
    });

    this._route.get(
      USER_AUTH.GET_PROFILE_IMG,
      ...userOrInvestorGuard,
      (req: Request, res: Response, next: NextFunction) => {
        userAuthController.handleProfileImg(req, res, next);
      }
    );

    this._route.post(
      USER_AUTH.SET_INTERESTED_TOPICS,
      ...userOrInvestorGuard,
      (req: Request, res: Response, next: NextFunction) => {
        userAuthController.handleInterestedTopics(req, res, next);
      }
    );

    this._route.get(
      ROUTES.USERS.PROFILE.FETCH_DATA,
      ...userOrInvestorGuard,
      (req: Request, res: Response, next: NextFunction) => {
        userProfileController.getProfileData(req, res, next);
      }
    );

    this._route.patch(
      ROUTES.USERS.PROFILE.UPDATE,
      ...userGuard,
      uploadMulter.fields([{ name: "profileImg", maxCount: 1 }]),
      (req: Request, res: Response, next: NextFunction) => {
        userProfileController.updateProfileData(req, res, next);
      }
    );
  }

  public get_router(): Router {
    return this._route;
  }
}

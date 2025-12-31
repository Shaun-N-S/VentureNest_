import { UserRole } from "@domain/enum/userRole";
import { adminInvestorController } from "@infrastructure/DI/Admin/adminInvestorContainer";
import { adminKycController } from "@infrastructure/DI/Admin/adminKycContainer";
import { adminProjectController } from "@infrastructure/DI/Admin/adminProjectContainer";
import { adminUserController } from "@infrastructure/DI/Admin/adminUserContainer";
import { adminAuthController, authMiddleware } from "@infrastructure/DI/Auth/authContainer";
import { ROUTES } from "@shared/constants/routes";
import { NextFunction, Request, Response, Router } from "express";
import { adminGuard } from "interfaceAdapters/middleware/guards";

export class Admin_Routes {
  private _route: Router;
  constructor() {
    this._route = Router();
    this._setRoute();
  }

  private _setRoute() {
    const ADMIN = ROUTES.ADMIN;

    const ADMIN_AUTH = ROUTES.AUTH.ADMIN;

    this._route.post(ADMIN_AUTH.LOGIN, (req: Request, res: Response, next: NextFunction) =>
      adminAuthController.adminLogin(req, res, next)
    );

    this._route.get(ADMIN.USERS, ...adminGuard, (req: Request, res: Response, next: NextFunction) =>
      adminUserController.getAllUsers(req, res, next)
    );

    this._route.post(
      ADMIN.UPDATE_USER_STATUS,
      ...adminGuard,
      (req: Request, res: Response, next: NextFunction) =>
        adminUserController.updateUserStatus(req, res, next)
    );

    this._route.get(
      ADMIN.INVESTORS,
      ...adminGuard,
      (req: Request, res: Response, next: NextFunction) =>
        adminInvestorController.getAllInvestor(req, res, next)
    );

    this._route.post(
      ADMIN.UPDATE_INVESTOR_STATUS,
      ...adminGuard,
      (req: Request, res: Response, next: NextFunction) =>
        adminInvestorController.updateInvestorStatus(req, res, next)
    );

    //KYC SECTION
    this._route.get(
      ADMIN.FETCH_USER_KYC,
      ...adminGuard,
      (req: Request, res: Response, next: NextFunction) => {
        adminKycController.getAllUserKyc(req, res, next);
      }
    );

    this._route.get(
      ADMIN.FETCH_INVESTOR_KYC,
      ...adminGuard,
      (req: Request, res: Response, next: NextFunction) => {
        adminKycController.getAllInvestorKyc(req, res, next);
      }
    );

    this._route.patch(
      ADMIN.UPDATE_USER_KYC,
      ...adminGuard,
      (req: Request, res: Response, next: NextFunction) => {
        adminKycController.updateUserKycStatus(req, res, next);
      }
    );

    this._route.patch(
      ADMIN.UPDATE_INVESTOR_KYC,
      ...adminGuard,
      (req: Request, res: Response, next: NextFunction) => {
        adminKycController.udpateInvestorKycStatus(req, res, next);
      }
    );

    //PROJECT
    this._route.get(
      ADMIN.PROJECTS,
      ...adminGuard,
      (req: Request, res: Response, next: NextFunction) => {
        adminProjectController.getAllProjects(req, res, next);
      }
    );

    this._route.patch(
      ADMIN.UPDATE_PROJECT_STATUS,
      ...adminGuard,
      (req: Request, res: Response, next: NextFunction) => {
        adminProjectController.updateProjectStatus(req, res, next);
      }
    );
  }

  public get_router(): Router {
    return this._route;
  }
}

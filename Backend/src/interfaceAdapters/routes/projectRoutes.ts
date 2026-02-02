import {
  projectController,
  projectMonthlyReportController,
  projectRegistrationController,
} from "@infrastructure/DI/Project/projectContainer";
import { ROUTES } from "@shared/constants/routes";
import { NextFunction, Request, Response, Router } from "express";
import { userOrInvestorGuard } from "interfaceAdapters/middleware/guards";
import { uploadMulter } from "interfaceAdapters/middleware/multer";

export class Project_Router {
  private _route: Router;

  constructor() {
    this._route = Router();
    this._setRoute();
  }

  private _setRoute() {
    this._route.post(
      ROUTES.PROJECT.CREATE,
      ...userOrInvestorGuard,
      uploadMulter.fields([
        { name: "pitchDeckUrl", maxCount: 1 },
        { name: "logoUrl", maxCount: 1 },
        { name: "coverImageUrl", maxCount: 1 },
      ]),
      (req: Request, res: Response, next: NextFunction) => {
        projectController.addProject(req, res, next);
      }
    );

    this._route.patch(
      ROUTES.PROJECT.UPDATE,
      ...userOrInvestorGuard,
      uploadMulter.fields([
        { name: "pitchDeckUrl", maxCount: 1 },
        { name: "logoUrl", maxCount: 1 },
        { name: "coverImageUrl", maxCount: 1 },
      ]),
      (req: Request, res: Response, next: NextFunction) => {
        projectController.updateProject(req, res, next);
      }
    );

    this._route.get(
      ROUTES.PROJECT.FETCH_PROJECTS,
      ...userOrInvestorGuard,
      (req: Request, res: Response, next: NextFunction) => {
        projectController.fetchAllProjects(req, res, next);
      }
    );

    this._route.get(
      ROUTES.PROJECT.PERSONAL_PROJECTS,
      ...userOrInvestorGuard,
      (req: Request, res: Response, next: NextFunction) => {
        projectController.fetchPersonalProjects(req, res, next);
      }
    );

    this._route.get(
      ROUTES.PROJECT.PERSONAL_PROJECT_BY_ID,
      ...userOrInvestorGuard,
      (req: Request, res: Response, next: NextFunction) => {
        projectController.fetchPersonalProjectsById(req, res, next);
      }
    );

    this._route.get(
      ROUTES.PROJECT.SINGLE_PROJECT,
      // ...userOrInvestorGuard,
      (req: Request, res: Response, next: NextFunction) => {
        projectController.findProjectById(req, res, next);
      }
    );

    this._route.patch(
      ROUTES.PROJECT.REMOVE,
      ...userOrInvestorGuard,
      (req: Request, res: Response, next: NextFunction) => {
        projectController.removeProject(req, res, next);
      }
    );

    this._route.post(
      ROUTES.PROJECT.ADD_MONTHLY_REPORT,
      ...userOrInvestorGuard,
      uploadMulter.none(),
      (req: Request, res: Response, next: NextFunction) => {
        projectMonthlyReportController.addMonthlyReport(req, res, next);
      }
    );

    this._route.post(
      ROUTES.PROJECT.VERIFY_PROJECT,
      ...userOrInvestorGuard,
      uploadMulter.fields([
        { name: "gstCertificate", maxCount: 1 },
        { name: "companyRegistrationCertificate", maxCount: 1 },
      ]),
      (req: Request, res: Response, next: NextFunction) => {
        projectRegistrationController.registerProject(req, res, next);
      }
    );

    this._route.post(
      ROUTES.PROJECT.LIKE,
      ...userOrInvestorGuard,
      (req: Request, res: Response, next: NextFunction) => {
        projectController.likeProject(req, res, next);
      }
    );
  }

  public get_router(): Router {
    return this._route;
  }
}

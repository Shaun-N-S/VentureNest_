import { authMiddleware } from "@infrastructure/DI/Auth/authContainer";
import { projectController } from "@infrastructure/DI/Project/projectContainer";
import { ROUTES } from "@shared/constants/routes";
import { NextFunction, Request, Response, Router } from "express";
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
      authMiddleware.verify,
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
      authMiddleware.verify,
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
      authMiddleware.verify,
      (req: Request, res: Response, next: NextFunction) => {
        projectController.fetchAllProjects(req, res, next);
      }
    );

    this._route.get(
      ROUTES.PROJECT.PERSONAL_PROJECTS,
      authMiddleware.verify,
      (req: Request, res: Response, next: NextFunction) => {
        projectController.fetchPersonalProjects(req, res, next);
      }
    );

    this._route.get(
      ROUTES.PROJECT.SINGLE_PROJECT,
      authMiddleware.verify,
      (req: Request, res: Response, next: NextFunction) => {
        projectController.findProjectById(req, res, next);
      }
    );

    this._route.patch(
      ROUTES.PROJECT.REMOVE,
      authMiddleware.verify,
      (req: Request, res: Response, next: NextFunction) => {
        projectController.removeProject(req, res, next);
      }
    );
  }

  public get_router(): Router {
    return this._route;
  }
}

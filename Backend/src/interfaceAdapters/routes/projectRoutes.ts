import { authMiddleware } from "@infrastructure/DI/Auth/authContainer";
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
        // projectController.createProject(req, res, next);
      }
    );
  }

  public get_router(): Router {
    return this._route;
  }
}

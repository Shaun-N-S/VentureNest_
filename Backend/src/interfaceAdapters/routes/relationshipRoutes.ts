import { authMiddleware } from "@infrastructure/DI/Auth/authContainer";
import { relationshipController } from "@infrastructure/DI/Relationship/relationshipContainer";
import { ROUTES } from "@shared/constants/routes";
import { NextFunction, Request, Response, Router } from "express";

export class Relationship_Router {
  private _route: Router;

  constructor() {
    this._route = Router();
    this._setRoute();
  }

  private _setRoute() {
    this._route.get(
      ROUTES.RELATIONSHIP.GET_USERS,
      authMiddleware.verify,
      (req: Request, res: Response, next: NextFunction) => {
        relationshipController.getNetworkUsers(req, res, next);
      }
    );

    this._route.post(
      ROUTES.RELATIONSHIP.CONNECTION_REQ,
      authMiddleware.verify,
      (req: Request, res: Response, next: NextFunction) => {
        relationshipController.sendConnection(req, res, next);
      }
    );

    this._route.get(
      ROUTES.RELATIONSHIP.GET_PERSONAL_CONNECTION_REQ,
      authMiddleware.verify,
      (req: Request, res: Response, next: NextFunction) => {
        relationshipController.getConnectionReq(req, res, next);
      }
    );

    this._route.patch(
      ROUTES.RELATIONSHIP.UPDATE_CONNECTION_REQ,
      authMiddleware.verify,
      (req: Request, res: Response, next: NextFunction) => {
        relationshipController.updateConnectionReqStaus(req, res, next);
      }
    );
  }

  public get_router(): Router {
    return this._route;
  }
}

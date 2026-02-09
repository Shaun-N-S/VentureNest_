import { relationshipController } from "@infrastructure/DI/Relationship/relationshipContainer";
import { ROUTES } from "@shared/constants/routes";
import { NextFunction, Request, Response, Router } from "express";
import { userOrInvestorGuard } from "interfaceAdapters/middleware/guards";

export class Relationship_Router {
  private _route: Router;

  constructor() {
    this._route = Router();
    this._setRoute();
  }

  private _setRoute() {
    this._route.get(
      ROUTES.RELATIONSHIP.GET_USERS,
      ...userOrInvestorGuard,
      (req: Request, res: Response, next: NextFunction) => {
        relationshipController.getNetworkUsers(req, res, next);
      }
    );

    this._route.post(
      ROUTES.RELATIONSHIP.CONNECTION_REQ,
      ...userOrInvestorGuard,
      (req: Request, res: Response, next: NextFunction) => {
        relationshipController.sendConnection(req, res, next);
      }
    );

    this._route.get(
      ROUTES.RELATIONSHIP.GET_PERSONAL_CONNECTION_REQ,
      ...userOrInvestorGuard,
      (req: Request, res: Response, next: NextFunction) => {
        relationshipController.getConnectionReq(req, res, next);
      }
    );

    this._route.patch(
      ROUTES.RELATIONSHIP.UPDATE_CONNECTION_REQ,
      ...userOrInvestorGuard,
      (req: Request, res: Response, next: NextFunction) => {
        relationshipController.updateConnectionReqStaus(req, res, next);
      }
    );

    this._route.get(
      ROUTES.RELATIONSHIP.GET_CONNECTIONS_PEOPLE,
      ...userOrInvestorGuard,
      (req: Request, res: Response, next: NextFunction) => {
        relationshipController.getConnectionsPeopleList(req, res, next);
      }
    );

    this._route.delete(
      ROUTES.RELATIONSHIP.REMOVE_CONNECTION,
      ...userOrInvestorGuard,
      (req: Request, res: Response, next: NextFunction) => {
        relationshipController.removeConnection(req, res, next);
      }
    );

    this._route.get(
      ROUTES.RELATIONSHIP.GET_RELATIONSHIP_STATUS,
      ...userOrInvestorGuard,
      (req: Request, res: Response, next: NextFunction) => {
        relationshipController.getRelationshipStatus(req, res, next);
      }
    );

    this._route.get(
      ROUTES.RELATIONSHIP.GET_USER_CONNECTIONS_PEOPLE,
      ...userOrInvestorGuard,
      (req: Request, res: Response, next: NextFunction) => {
        relationshipController.getUserConnectionsPeopleList(req, res, next);
      }
    );
  }

  public get_router(): Router {
    return this._route;
  }
}

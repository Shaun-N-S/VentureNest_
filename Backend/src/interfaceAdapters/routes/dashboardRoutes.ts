import { Router, Request, Response, NextFunction } from "express";
import { ROUTES } from "@shared/constants/routes";
import { investorGuard, userGuard, userOrInvestorGuard } from "interfaceAdapters/middleware/guards";
import { dashboardController } from "@infrastructure/DI/Dashboard/dashboardContainer";

export class Dashboard_Router {
  private _route: Router;

  constructor() {
    this._route = Router();
    this._setRoutes();
  }

  private _setRoutes() {
    this._route.get(
      ROUTES.DASHBOARD.USER,
      ...userGuard,
      (req: Request, res: Response, next: NextFunction) => {
        dashboardController.getUserDashboard(req, res, next);
      }
    );

    this._route.get(
      ROUTES.DASHBOARD.PROJECT_ANALYTICS,
      ...userOrInvestorGuard,
      (req: Request, res: Response, next: NextFunction) => {
        dashboardController.getProjectAnalytics(req, res, next);
      }
    );

    this._route.get(
      ROUTES.DASHBOARD.INVESTOR_SUMMARY,
      ...investorGuard,
      (req: Request, res: Response, next: NextFunction) => {
        dashboardController.getInvestorDashboardSummary(req, res, next);
      }
    );

    this._route.get(
      ROUTES.DASHBOARD.INVESTOR_PORTFOLIO,
      ...userOrInvestorGuard,
      (req: Request, res: Response, next: NextFunction) => {
        dashboardController.getInvestorPortfolio(req, res, next);
      }
    );

    this._route.get(
      ROUTES.DASHBOARD.INVESTMENT_CHART,
      ...userOrInvestorGuard,
      (req: Request, res: Response, next: NextFunction) => {
        dashboardController.getInvestmentChart(req, res, next);
      }
    );
  }

  public get_router(): Router {
    return this._route;
  }
}

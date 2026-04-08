import { Request, Response, NextFunction } from "express";
import { IGetAdminDashboardSummaryUseCase } from "@domain/interfaces/useCases/admin/dashboard/IGetAdminDashboardSummaryUseCase";
import { ResponseHelper } from "@shared/utils/responseHelper";
import { HTTPSTATUS } from "@shared/constants/httpStatus";
import { MESSAGES } from "@shared/constants/messages";
import { IGetAdminDashboardGraphUseCase } from "@domain/interfaces/useCases/admin/dashboard/IGetAdminDashboardGraphUseCase";
import { IGetAdminDashboardTopUseCase } from "@domain/interfaces/useCases/admin/dashboard/IGetAdminDashboardTopUseCase";

export class AdminDashboardController {
  constructor(
    private _getSummaryUseCase: IGetAdminDashboardSummaryUseCase,
    private _getGraphUseCase: IGetAdminDashboardGraphUseCase,
    private _getTopUseCase: IGetAdminDashboardTopUseCase
  ) {}

  async getSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this._getSummaryUseCase.execute();

      ResponseHelper.success(res, MESSAGES.ADMIN.DASHBOARD_SUMMARY_FETCHED, result, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  async getGraph(req: Request, res: Response, next: NextFunction) {
    try {
      const params = {
        type: req.query.type as "subscription" | "commission",
        ...(req.query.year && { year: Number(req.query.year) }),
        ...(req.query.month && { month: Number(req.query.month) }),
        ...(req.query.fromDate && { fromDate: new Date(req.query.fromDate as string) }),
        ...(req.query.toDate && { toDate: new Date(req.query.toDate as string) }),
      };

      const result = await this._getGraphUseCase.execute(params);

      ResponseHelper.success(res, MESSAGES.ADMIN.GRAPH_FETCHED, result, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  async getTop(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this._getTopUseCase.execute();

      ResponseHelper.success(res, MESSAGES.ADMIN.TOP_DATA_FETCHED, result, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }
}

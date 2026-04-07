import { Request, Response, NextFunction } from "express";
import { IGetUserDashboardUseCase } from "@domain/interfaces/useCases/dashboard/IGetUserDashboardUseCase";
import { ResponseHelper } from "@shared/utils/responseHelper";
import { HTTPSTATUS } from "@shared/constants/httpStatus";
import { MESSAGES } from "@shared/constants/messages";
import { IGetProjectReportAnalyticsUseCase } from "@domain/interfaces/useCases/dashboard/IGetProjectReportAnalyticsUseCase";
import { InvalidDataException } from "application/constants/exceptions";
import { Errors } from "@shared/constants/error";
import { GetProjectReportAnalyticsRequestDTO } from "application/dto/dashboard/projectReportAnalyticsDTO";
import { IGetInvestorDashboardSummaryUseCase } from "@domain/interfaces/useCases/dashboard/IGetInvestorDashboardSummaryUseCase";
import { IGetInvestorPortfolioUseCase } from "@domain/interfaces/useCases/dashboard/IGetInvestorPortfolioUseCase";

export class DashboardController {
  constructor(
    private getUserDashboardUseCase: IGetUserDashboardUseCase,
    private _getProjectAnalyticsUseCase: IGetProjectReportAnalyticsUseCase,
    private _getInvestorDashboardSummaryUseCase: IGetInvestorDashboardSummaryUseCase,
    private _getInvestorPortfolioUseCase: IGetInvestorPortfolioUseCase
  ) {}

  async getUserDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.user;

      const data = await this.getUserDashboardUseCase.execute(user.userId);

      ResponseHelper.success(res, MESSAGES.DASHBOARD.FETCHED, data, HTTPSTATUS.OK);
    } catch (err) {
      next(err);
    }
  }

  async getProjectAnalytics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { projectId, fromDate, toDate, month, year } = req.query;

      if (!projectId) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      const dto: GetProjectReportAnalyticsRequestDTO = {
        projectId: projectId as string,
      };

      if (fromDate) dto.fromDate = fromDate as string;
      if (toDate) dto.toDate = toDate as string;
      if (month) dto.month = month as string;
      if (year !== undefined) dto.year = Number(year);

      const data = await this._getProjectAnalyticsUseCase.execute(dto);

      ResponseHelper.success(res, MESSAGES.DASHBOARD.FETCHED, data, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  async getInvestorDashboardSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.user;

      const data = await this._getInvestorDashboardSummaryUseCase.execute(user.userId);

      ResponseHelper.success(res, MESSAGES.DASHBOARD.FETCHED, data, HTTPSTATUS.OK);
    } catch (err) {
      next(err);
    }
  }

  async getInvestorPortfolio(req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.user;

      const data = await this._getInvestorPortfolioUseCase.execute(user.userId);

      ResponseHelper.success(res, MESSAGES.DASHBOARD.FETCHED, data, HTTPSTATUS.OK);
    } catch (err) {
      next(err);
    }
  }
}

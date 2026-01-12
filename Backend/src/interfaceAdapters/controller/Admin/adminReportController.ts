import { NextFunction, Request, Response } from "express";
import { ResponseHelper } from "@shared/utils/responseHelper";
import { HTTPSTATUS } from "@shared/constants/httpStatus";
import { MESSAGES } from "@shared/constants/messages";
import { IGetReportedPostsUseCase } from "@domain/interfaces/useCases/admin/report/IGetReportedPostsUseCase";
import { IGetReportedProjectsUseCase } from "@domain/interfaces/useCases/admin/report/IGetReportedProjectsUseCase";
import { IGetPostReportsUseCase } from "@domain/interfaces/useCases/admin/report/IGetPostReportsUseCase";
import { InvalidDataException } from "application/constants/exceptions";
import { Errors } from "@shared/constants/error";
import { IGetProjectReportsUseCase } from "@domain/interfaces/useCases/admin/report/IGetProjectReportsUseCase";
import { updateReportStatusSchema } from "@shared/validations/updateReportStatusValidator";
import { IUpdateReportStatusUseCase } from "@domain/interfaces/useCases/admin/report/IUpdateReportStatusUseCase";

export class AdminReportController {
  constructor(
    private _getReportedPostsUseCase: IGetReportedPostsUseCase,
    private _getReportedProjectsUseCase: IGetReportedProjectsUseCase,
    private _getPostReportsUseCase: IGetPostReportsUseCase,
    private _getProjectReportsUseCase: IGetProjectReportsUseCase,
    private _updateReportStatusUseCase: IUpdateReportStatusUseCase
  ) {}

  async getReportedPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const reports = await this._getReportedPostsUseCase.execute();

      ResponseHelper.success(res, MESSAGES.REPORT.REPORTED_POSTS_FETCHED, reports, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  async getReportedProjects(req: Request, res: Response, next: NextFunction) {
    try {
      const reports = await this._getReportedProjectsUseCase.execute();

      ResponseHelper.success(
        res,
        MESSAGES.REPORT.REPORTED_PROJECTS_FETCHED,
        reports,
        HTTPSTATUS.OK
      );
    } catch (error) {
      next(error);
    }
  }

  async getPostReports(req: Request, res: Response, next: NextFunction) {
    try {
      const { postId } = req.params;

      if (!postId) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      const data = await this._getPostReportsUseCase.execute(postId);

      ResponseHelper.success(res, MESSAGES.REPORT.POST_REPORTS_FETCHED, data, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  async getProjectReports(req: Request, res: Response, next: NextFunction) {
    try {
      const { projectId } = req.params;

      if (!projectId) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      const data = await this._getProjectReportsUseCase.execute(projectId);

      ResponseHelper.success(res, MESSAGES.REPORT.PROJECT_REPORTS_FETCHED, data, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  async updateReportStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { reportId } = req.params;
      const adminId = res.locals?.user?.userId;

      console.log("reportId : ", reportId, "adminId : ,", adminId);

      if (!reportId || !adminId) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      const parsed = updateReportStatusSchema.safeParse(req.body);

      if (!parsed.success) {
        throw new InvalidDataException(parsed.error.flatten().fieldErrors as any);
      }

      const dto = {
        status: parsed.data.status,
        ...(parsed.data.actionTaken && { actionTaken: parsed.data.actionTaken }),
      };

      const result = await this._updateReportStatusUseCase.execute(reportId, adminId, dto);

      ResponseHelper.success(res, MESSAGES.REPORT.REPORT_STATUS_UPDATED, result, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }
}

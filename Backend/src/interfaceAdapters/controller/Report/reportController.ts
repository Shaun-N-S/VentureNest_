import { ReporterType } from "@domain/enum/reporterRole";
import { ICreateReportUseCase } from "@domain/interfaces/useCases/report/ICreateReportUseCase";
import { Errors } from "@shared/constants/error";
import { HTTPSTATUS } from "@shared/constants/httpStatus";
import { MESSAGES } from "@shared/constants/messages";
import { ResponseHelper } from "@shared/utils/responseHelper";
import { createReportSchema } from "@shared/validations/reportValidator";
import { InvalidDataException } from "application/constants/exceptions";
import { CreateReportDTO } from "application/dto/report/createReportDTO";
import { NextFunction, Request, Response } from "express";

export class ReportController {
  constructor(private _createReportUseCase: ICreateReportUseCase) {}

  async createReport(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const reporterId = res.locals?.user?.userId;
      const reporterRole = res.locals?.user?.role;

      if (!reporterId || !reporterRole) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      const parsed = createReportSchema.safeParse(req.body);

      if (!parsed.success) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      const { reportedItemId, reportedItemType, reasonCode, reasonText } = parsed.data;

      const reporterType = reporterRole === "INVESTOR" ? ReporterType.INVESTOR : ReporterType.USER;

      const dto: CreateReportDTO = {
        reportedById: reporterId,
        reportedByType: reporterType,
        targetType: reportedItemType,
        targetId: reportedItemId,
        reasonCode,
        ...(reasonText && { reasonText }),
      };

      const result = await this._createReportUseCase.createReport(dto);

      ResponseHelper.success(
        res,
        MESSAGES.REPORT.REPORT_CREATED_SUCCESSFULLY,
        result,
        HTTPSTATUS.OK
      );
    } catch (error) {
      next(error);
    }
  }
}

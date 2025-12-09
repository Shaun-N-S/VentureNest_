import { Request, Response, NextFunction } from "express";
import { ICreateProjectMonthlyReportUseCase } from "@domain/interfaces/useCases/project/ICreateProjectMonthlyReportUseCase";
import { MulterFiles } from "@domain/types/multerFilesType";
import { CreateProjectMonthlyReportDTO } from "application/dto/project/projectMonthlyReportDTO";
import { CreateMonthlyReportReqSchema } from "@shared/validations/projectMonthlyReportValidator";
import { InvalidDataException } from "application/constants/exceptions";
import { Errors } from "@shared/constants/error";
import { ResponseHelper } from "@shared/utils/responseHelper";
import { MESSAGES } from "@shared/constants/messages";
import { HTTPSTATUS } from "@shared/constants/httpStatus";

export class MonthlyReportController {
  constructor(private _createMonthlyReportUseCase: ICreateProjectMonthlyReportUseCase) {}

  async addMonthlyReport(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = res.locals?.user?.userId;
      const projectId = req.params.projectId;

      if (!userId || !projectId) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      const formData = req.body;

      const rawData = {
        ...formData,
        projectId,
        year: Number(formData.year),
        revenue: Number(formData.revenue),
        expenditure: Number(formData.expenditure),
        netProfitLossAmount: Number(formData.netProfitLossAmount),
        isConfirmed: formData.isConfirmed === "true" || formData.isConfirmed === true,
      };

      const validated = CreateMonthlyReportReqSchema.safeParse(rawData);

      if (!validated.success) {
        console.log(validated.error);
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      const dto: CreateProjectMonthlyReportDTO = validated.data!;

      await this._createMonthlyReportUseCase.createMonthlyReport(dto);

      ResponseHelper.success(
        res,
        MESSAGES.PROJECT_MONTHLY_REPORT.REPORT_ADDED_SUCCESSFULLY,
        HTTPSTATUS.OK
      );
    } catch (error) {
      next(error);
    }
  }
}

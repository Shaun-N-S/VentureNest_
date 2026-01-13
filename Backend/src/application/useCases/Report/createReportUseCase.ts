import { IReportRepository } from "@domain/interfaces/repositories/IReportRepository";
import { ICreateReportUseCase } from "@domain/interfaces/useCases/report/ICreateReportUseCase";
import { CreateReportDTO } from "application/dto/report/createReportDTO";
import { ReportMapper } from "application/mappers/reportMapper";
import { ReportEntity } from "@domain/entities/report/reportEntity";
import { AlreadyExisitingExecption } from "application/constants/exceptions";
import { REPORT_ERRORS } from "@shared/constants/error";

export class CreateReportUseCase implements ICreateReportUseCase {
  constructor(private _reportRepository: IReportRepository) {}

  async createReport(data: CreateReportDTO): Promise<{ reportId: string }> {
    const { reportedById, reportedByType, targetType, targetId } = data;

    const alreadyReported = await this._reportRepository.existsDuplicate(
      reportedById,
      reportedByType,
      targetType,
      targetId
    );

    if (alreadyReported) {
      throw new AlreadyExisitingExecption(REPORT_ERRORS.ALREADY_REPORTED);
    }

    const reportEntity: ReportEntity = ReportMapper.toEntity(data);

    const savedReport = await this._reportRepository.save(reportEntity);

    return {
      reportId: savedReport._id!,
    };
  }
}

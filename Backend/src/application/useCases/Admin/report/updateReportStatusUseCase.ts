import { IReportRepository } from "@domain/interfaces/repositories/IReportRepository";
import { ReportStatus } from "@domain/enum/reportStatus";
import { DataMissingExecption, InvalidDataException } from "application/constants/exceptions";
import { Errors, REPORT_ERRORS } from "@shared/constants/error";
import { IUpdateReportStatusUseCase } from "@domain/interfaces/useCases/admin/report/IUpdateReportStatusUseCase";
import {
  AdminUpdatedReportDTO,
  UpdateReportStatusDTO,
} from "application/dto/report/adminReportDTO";
import { AdminReportMapper } from "application/mappers/adminReportMapper";

const VALID_TRANSITIONS: Record<ReportStatus, ReportStatus[]> = {
  [ReportStatus.PENDING]: [ReportStatus.REVIEWED, ReportStatus.REJECTED, ReportStatus.ACTION_TAKEN],
  [ReportStatus.REVIEWED]: [ReportStatus.ACTION_TAKEN, ReportStatus.ARCHIVED],
  [ReportStatus.ACTION_TAKEN]: [ReportStatus.ARCHIVED],
  [ReportStatus.REJECTED]: [ReportStatus.ARCHIVED],
  [ReportStatus.ARCHIVED]: [],
};

export class UpdateReportStatusUseCase implements IUpdateReportStatusUseCase {
  constructor(private reportRepository: IReportRepository) {}

  async execute(
    reportId: string,
    adminId: string,
    dto: UpdateReportStatusDTO
  ): Promise<AdminUpdatedReportDTO> {
    const report = await this.reportRepository.findById(reportId);

    if (!report) {
      throw new DataMissingExecption(REPORT_ERRORS.NO_REPORT_FOUND);
    }

    if (!VALID_TRANSITIONS[report.status].includes(dto.status)) {
      throw new InvalidDataException(Errors.INVALID_STATUS_TRANSITION);
    }

    const updated = await this.reportRepository.updateStatus(
      reportId,
      dto.status,
      adminId,
      dto.actionTaken
    );

    return AdminReportMapper.toDTO(updated!);
  }
}

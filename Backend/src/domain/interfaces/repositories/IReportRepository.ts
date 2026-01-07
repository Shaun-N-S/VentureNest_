import { ReportEntity } from "@domain/entities/report/reportEntity";
import { IBaseRepository } from "./IBaseRepository";
import { ReportStatus } from "@domain/enum/reportStatus";
import { ReportTargetType } from "@domain/enum/reporterTarget";
import { ReporterType } from "@domain/enum/reporterRole";

export interface IReportRepository extends IBaseRepository<ReportEntity> {
  existsDuplicate(
    reportedById: string,
    reportedByType: ReporterType,
    targetType: ReportTargetType,
    targetId: string
  ): Promise<boolean>;

  findByTarget(targetType: ReportTargetType, targetId: string): Promise<ReportEntity[]>;

  updateStatus(reportId: string, status: ReportStatus): Promise<ReportEntity | null>;
}

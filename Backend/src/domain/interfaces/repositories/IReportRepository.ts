import { ReportEntity } from "@domain/entities/report/reportEntity";
import { IBaseRepository } from "./IBaseRepository";
import { ReportStatus } from "@domain/enum/reportStatus";
import { ReportTargetType } from "@domain/enum/reporterTarget";
import { ReporterType } from "@domain/enum/reporterRole";
import {
  AdminReportedPostDTO,
  AdminReportedProjectDTO,
} from "application/dto/report/adminReportDTO";

export interface IReportRepository extends IBaseRepository<ReportEntity> {
  existsDuplicate(
    reportedById: string,
    reportedByType: ReporterType,
    targetType: ReportTargetType,
    targetId: string
  ): Promise<boolean>;

  findByTarget(targetType: ReportTargetType, targetId: string): Promise<ReportEntity[]>;

  getReportedPosts(): Promise<AdminReportedPostDTO[]>;

  getReportedProjects(): Promise<AdminReportedProjectDTO[]>;

  updateStatus(
    reportId: string,
    status: ReportStatus,
    reviewedBy: string,
    actionTaken?: string
  ): Promise<ReportEntity | null>;
}

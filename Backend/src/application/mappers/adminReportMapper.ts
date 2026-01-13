import { ReportEntity } from "@domain/entities/report/reportEntity";
import { UserEntity } from "@domain/entities/user/userEntity";
import { InvestorEntity } from "@domain/entities/investor/investorEntity";
import {
  AdminPostReportDetailDTO,
  AdminProjectReportDetailDTO,
  AdminUpdatedReportDTO,
} from "application/dto/report/adminReportDTO";

export class AdminReportMapper {
  static toPostReportDetailDTO(
    report: ReportEntity,
    reporter?: UserEntity | InvestorEntity
  ): AdminPostReportDetailDTO {
    return {
      reportId: report._id!,
      reporter: {
        id: report.reportedById,
        name: reporter?.userName ?? "Unknown",
        ...(reporter?.profileImg && { profileImg: reporter.profileImg }),
        role: report.reportedByType,
      },
      reasonCode: report.reasonCode,
      ...(report.reasonText && { reasonText: report.reasonText }),
      status: report.status,
      createdAt: report.createdAt!,
    };
  }

  static toProjectReportDetailDTO(
    report: ReportEntity,
    reporter?: UserEntity | InvestorEntity
  ): AdminProjectReportDetailDTO {
    return {
      reportId: report._id!,
      reporter: {
        id: report.reportedById,
        name: reporter?.userName ?? "Unknown",
        ...(reporter?.profileImg && { profileImg: reporter.profileImg }),
        role: report.reportedByType,
      },
      reasonCode: report.reasonCode,
      ...(report.reasonText && { reasonText: report.reasonText }),
      status: report.status,
      createdAt: report.createdAt!,
    };
  }

  static toDTO(report: ReportEntity): AdminUpdatedReportDTO {
    return {
      reportId: report._id!,
      status: report.status,
      reviewedBy: report.reviewedBy!,
      reviewedAt: report.reviewedAt!,
      ...(report.actionTaken && { actionTaken: report.actionTaken }),
    };
  }
}

import { ReporterType } from "@domain/enum/reporterRole";
import { ReportReason } from "@domain/enum/reportReason";
import { ReportStatus } from "@domain/enum/reportStatus";

export interface AdminReportedPostDTO {
  postId: string;

  reportCount: number;
  reasons: ReportReason[];

  latestReportAt: Date;
  status: ReportStatus;
}

export interface AdminReportedProjectDTO {
  projectId: string;

  reportCount: number;
  reasons: ReportReason[];

  latestReportAt: Date;
  status: ReportStatus;
}

export interface AdminPostReportDetailDTO {
  reportId: string;

  reporter: {
    id: string;
    name: string;
    profileImg?: string;
    role: ReporterType;
  };

  reasonCode: ReportReason;
  reasonText?: string;

  status: ReportStatus;
  createdAt: Date;
}

export interface AdminProjectReportDetailDTO {
  reportId: string;

  reporter: {
    id: string;
    name: string;
    profileImg?: string;
    role: ReporterType;
  };

  reasonCode: ReportReason;
  reasonText?: string;

  status: ReportStatus;
  createdAt: Date;
}

export interface UpdateReportStatusDTO {
  status: ReportStatus;
  actionTaken?: string;
}

export interface AdminUpdatedReportDTO {
  reportId: string;
  status: ReportStatus;
  reviewedBy: string;
  reviewedAt: Date;
  actionTaken?: string;
}

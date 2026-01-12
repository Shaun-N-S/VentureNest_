import { IReportRepository } from "@domain/interfaces/repositories/IReportRepository";
import { IUserRepository } from "@domain/interfaces/repositories/IUserRepository";
import { ReportTargetType } from "@domain/enum/reporterTarget";
import { ReporterType } from "@domain/enum/reporterRole";
import { IGetProjectReportsUseCase } from "@domain/interfaces/useCases/admin/report/IGetProjectReportsUseCase";
import { IInvestorRepository } from "@domain/interfaces/repositories/IInvestorRespository";
import { AdminProjectReportDetailDTO } from "application/dto/report/adminReportDTO";
import { AdminReportMapper } from "application/mappers/adminReportMapper";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";

export class GetProjectReportsUseCase implements IGetProjectReportsUseCase {
  constructor(
    private _reportRepository: IReportRepository,
    private _userRepository: IUserRepository,
    private _investorRepository: IInvestorRepository,
    private _storageService: IStorageService
  ) {}

  async execute(projectId: string): Promise<AdminProjectReportDetailDTO[]> {
    const reports = await this._reportRepository.findByTarget(ReportTargetType.PROJECT, projectId);

    if (!reports.length) return [];

    const userIds = new Set<string>();
    const investorIds = new Set<string>();

    for (const report of reports) {
      report.reportedByType === ReporterType.USER
        ? userIds.add(report.reportedById)
        : investorIds.add(report.reportedById);
    }

    const [users, investors] = await Promise.all([
      this._userRepository.findByIds([...userIds]),
      this._investorRepository.findByIds([...investorIds]),
    ]);

    const userMap = new Map(users.map((u) => [u._id!, u]));
    const investorMap = new Map(investors.map((i) => [i._id!, i]));

    return Promise.all(
      reports.map(async (report) => {
        const reporter =
          report.reportedByType === ReporterType.USER
            ? userMap.get(report.reportedById)
            : investorMap.get(report.reportedById);

        if (reporter?.profileImg) {
          reporter.profileImg = await this._storageService.createSignedUrl(
            reporter.profileImg,
            10 * 60
          );
        } else if (reporter) {
          reporter.profileImg = "";
        }

        return AdminReportMapper.toProjectReportDetailDTO(report, reporter);
      })
    );
  }
}

import { IReportRepository } from "@domain/interfaces/repositories/IReportRepository";
import { IUserRepository } from "@domain/interfaces/repositories/IUserRepository";
import { ReportTargetType } from "@domain/enum/reporterTarget";
import { ReporterType } from "@domain/enum/reporterRole";
import { AdminReportMapper } from "application/mappers/adminReportMapper";
import { IGetPostReportsUseCase } from "@domain/interfaces/useCases/admin/report/IGetPostReportsUseCase";
import { IInvestorRepository } from "@domain/interfaces/repositories/IInvestorRespository";
import { AdminPostReportDetailDTO } from "application/dto/report/adminReportDTO";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";
import { CONFIG } from "@config/config";

export class GetPostReportsUseCase implements IGetPostReportsUseCase {
  constructor(
    private _reportRepository: IReportRepository,
    private _userRepository: IUserRepository,
    private _investorRepository: IInvestorRepository,
    private _storageService: IStorageService
  ) {}

  async execute(postId: string): Promise<AdminPostReportDetailDTO[]> {
    const reports = await this._reportRepository.findByTarget(ReportTargetType.POST, postId);

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
            CONFIG.SIGNED_URL_EXPIRY
          );
        } else if (reporter) {
          reporter.profileImg = "";
        }

        return AdminReportMapper.toPostReportDetailDTO(report, reporter);
      })
    );
  }
}

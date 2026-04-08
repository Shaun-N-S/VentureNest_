import { IGetAdminDashboardTopUseCase } from "@domain/interfaces/useCases/admin/dashboard/IGetAdminDashboardTopUseCase";
import { IDealRepository } from "@domain/interfaces/repositories/IDealRepository";
import { IProjectRepository } from "@domain/interfaces/repositories/IProjectRepository";
import { IInvestorRepository } from "@domain/interfaces/repositories/IInvestorRespository";
import { AdminDashboardTopDTO } from "application/dto/admin/adminDashboardTopDTO";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";
import { CONFIG } from "@config/config";

export class GetAdminDashboardTopUseCase implements IGetAdminDashboardTopUseCase {
  constructor(
    private _dealRepo: IDealRepository,
    private _projectRepo: IProjectRepository,
    private _investorRepo: IInvestorRepository,
    private _storageService: IStorageService
  ) {}

  async execute(): Promise<AdminDashboardTopDTO> {
    const [topStartupsRaw, topInvestorsRaw] = await Promise.all([
      this._dealRepo.getTopStartups(5),
      this._dealRepo.getTopInvestors(5),
    ]);

    const projectIds = topStartupsRaw.map((s) => s.projectId);
    const projects = await this._projectRepo.findByIds(projectIds);

    const topStartups = await Promise.all(
      topStartupsRaw.map(async (s) => {
        const project = projects.find((p) => p._id?.toString() === s.projectId);

        let logoUrl: string | undefined;

        if (project?.logoUrl) {
          logoUrl = await this._storageService.createSignedUrl(
            project.logoUrl,
            CONFIG.SIGNED_URL_EXPIRY
          );
        }

        return {
          projectId: s.projectId,
          startupName: project?.startupName || "Unknown",
          totalFunding: s.totalFunding,
          ...(logoUrl && { logoUrl }),
        };
      })
    );

    const investorIds = topInvestorsRaw.map((i) => i.investorId);
    const investors = await this._investorRepo.findByIds(investorIds);

    const topInvestors = await Promise.all(
      topInvestorsRaw.map(async (i) => {
        const investor = investors.find((inv) => inv._id?.toString() === i.investorId);

        let profileImg: string | undefined;

        if (investor?.profileImg) {
          profileImg = await this._storageService.createSignedUrl(
            investor.profileImg,
            CONFIG.SIGNED_URL_EXPIRY
          );
        }

        return {
          investorId: i.investorId,
          userName: investor?.userName || "Unknown",
          totalInvested: i.totalInvested,
          ...(profileImg && { profileImg }),
        };
      })
    );

    return {
      topStartups,
      topInvestors,
    };
  }
}

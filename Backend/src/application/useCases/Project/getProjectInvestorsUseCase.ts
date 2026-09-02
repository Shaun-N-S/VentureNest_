import { CONFIG } from "@config/config";
import { UserRole } from "@domain/enum/userRole";
import { IDealRepository } from "@domain/interfaces/repositories/IDealRepository";
import { IProjectRepository } from "@domain/interfaces/repositories/IProjectRepository";
import { ISubscriptionRepository } from "@domain/interfaces/repositories/ISubscriptionRepository";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";
import { IGetProjectInvestorsUseCase } from "@domain/interfaces/useCases/project/IGetProjectInvestorsUseCase";
import { PROJECT_ERRORS, SUBSCRIPTION_ERRORS } from "@shared/constants/error";
import { ForbiddenException, NotFoundExecption } from "application/constants/exceptions";
import {
  GetProjectInvestorsRequestDTO,
  GetProjectInvestorsResponseDTO,
} from "application/dto/project/projectInvestorDTO";

export class GetProjectInvestorsUseCase implements IGetProjectInvestorsUseCase {
  constructor(
    private _projectRepo: IProjectRepository,
    private _dealRepo: IDealRepository,
    private _subscriptionRepo: ISubscriptionRepository,
    private _storageService: IStorageService
  ) {}

  async execute(request: GetProjectInvestorsRequestDTO): Promise<GetProjectInvestorsResponseDTO> {
    const { projectId, page, limit, search, viewerId, viewerRole } = request;

    const project = await this._projectRepo.findById(projectId);
    if (!project) {
      throw new NotFoundExecption(PROJECT_ERRORS.NO_PROJECTS_FOUND);
    }

    // ---- Access control ---------------------------------------------------
    // Admin: always allowed. Project owner: always allowed (their own cap table).
    // Everyone else (USER / INVESTOR): must have an active, non-expired subscription.
    const isAdmin = viewerRole === UserRole.ADMIN;
    const isOwner = project.userId === viewerId;

    if (!isAdmin && !isOwner) {
      const activeSubscription = await this._subscriptionRepo.findActiveByOwner(
        viewerId,
        viewerRole as UserRole
      );
      if (!activeSubscription) {
        throw new ForbiddenException(SUBSCRIPTION_ERRORS.INVESTOR_INSIGHTS_REQUIRED);
      }
    }
    // ---------------------------------------------------------------------

    const skip = (page - 1) * limit;

    const { rows, total } = await this._dealRepo.findProjectInvestorsPage(projectId, {
      skip,
      limit,
      search,
    });

    const investors = await Promise.all(
      rows.map(async (row) => ({
        investorId: row.investorId,
        name: row.investorName ?? "Unknown investor",
        companyName: row.investorCompany || null,
        avatar: row.investorAvatar
          ? await this._storageService.createSignedUrl(row.investorAvatar, CONFIG.SIGNED_URL_EXPIRY)
          : null,
        investedAmount: row.investedAmount,
        equityPercentage: row.equityPercentage,
        status: row.status,
        since: row.since,
      }))
    );

    return {
      investors,
      total,
      currentPage: page,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  }
}

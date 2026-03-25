import { IGetProjectWithdrawalsUseCase } from "@domain/interfaces/useCases/wallet/IGetProjectWithdrawalsUseCase";
import { IWithdrawalRepository } from "@domain/interfaces/repositories/IWithdrawalRepository";
import { IProjectRepository } from "@domain/interfaces/repositories/IProjectRepository";
import {
  GetProjectWithdrawalsRequestDTO,
  GetProjectWithdrawalsResponseDTO,
} from "application/dto/wallet/getProjectWithdrawalsDTO";
import { InvalidDataException, NotFoundExecption } from "application/constants/exceptions";
import { PROJECT_ERRORS, WALLET_ERRORS } from "@shared/constants/error";

export class GetProjectWithdrawalsUseCase implements IGetProjectWithdrawalsUseCase {
  constructor(
    private _withdrawalRepo: IWithdrawalRepository,
    private _projectRepo: IProjectRepository
  ) {}

  async execute(
    userId: string,
    dto: GetProjectWithdrawalsRequestDTO
  ): Promise<GetProjectWithdrawalsResponseDTO> {
    const { projectId, page, limit } = dto;

    const project = await this._projectRepo.findById(projectId);

    if (!project) {
      throw new NotFoundExecption(PROJECT_ERRORS.NO_PROJECTS_FOUND);
    }

    if (project.userId !== userId) {
      throw new InvalidDataException(WALLET_ERRORS.WITHDRAWAL_UNAUTHORIZED_ACCESS);
    }

    const skip = (page - 1) * limit;

    const filter = { projectId };

    const data = await this._withdrawalRepo.findAllPaginated(filter, skip, limit);

    const total = await this._withdrawalRepo.count(undefined, undefined, filter);

    return {
      data: data.map((w) => ({
        withdrawalId: w._id!,
        amount: w.amount,
        status: w.status,
        reason: w.reason,
        createdAt: w.createdAt!,
      })),
      total,
      page,
      limit,
    };
  }
}

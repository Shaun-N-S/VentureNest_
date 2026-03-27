import { WithdrawalEntity } from "@domain/entities/wallet/withdrawalEntity";
import { WithdrawalStatus } from "@domain/enum/WithdrawalStatus";
import { IWithdrawalRepository } from "@domain/interfaces/repositories/IWithdrawalRepository";
import { IGetWithdrawalsUseCase } from "@domain/interfaces/useCases/admin/finance/withdrawal/IGetWithdrawalsUseCase";
import {
  GetWithdrawalsRequestDTO,
  GetWithdrawalsResponseDTO,
} from "application/dto/wallet/getWithdrawalsDTO";
import { WithdrawalListMapper } from "application/mappers/withdrawalListMapper";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";
import { CONFIG } from "@config/config";

export class GetWithdrawaluseCase implements IGetWithdrawalsUseCase {
  constructor(
    private _withdrawalRepo: IWithdrawalRepository,
    private _storageService: IStorageService
  ) {}

  async execute(dto: GetWithdrawalsRequestDTO): Promise<GetWithdrawalsResponseDTO> {
    const { page, limit, status, projectId, search } = dto;

    const skip = (page - 1) * limit;

    const filter: Partial<WithdrawalEntity> = {};

    if (status) filter.status = status as WithdrawalStatus;
    if (projectId) filter.projectId = projectId;

    const data = await this._withdrawalRepo.findAllPaginated(filter, skip, limit, search);

    const total = await this._withdrawalRepo.countWithSearch(filter, search);

    const mappedData = await Promise.all(
      data.map(async (doc) => {
        const dtoItem = WithdrawalListMapper.toDTO(doc);

        if (dtoItem.project?.logoUrl) {
          dtoItem.project.logoUrl = await this._storageService.createSignedUrl(
            dtoItem.project.logoUrl,
            CONFIG.SIGNED_URL_EXPIRY
          );
        }

        if (dtoItem.project?.founder?.profileImg) {
          dtoItem.project.founder.profileImg = await this._storageService.createSignedUrl(
            dtoItem.project.founder.profileImg,
            CONFIG.SIGNED_URL_EXPIRY
          );
        }

        return dtoItem;
      })
    );

    return {
      data: mappedData,
      total,
      page,
      limit,
    };
  }
}

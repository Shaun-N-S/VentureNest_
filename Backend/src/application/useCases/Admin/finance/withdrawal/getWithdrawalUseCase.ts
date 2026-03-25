import { WithdrawalEntity } from "@domain/entities/wallet/withdrawalEntity";
import { WithdrawalStatus } from "@domain/enum/WithdrawalStatus";
import { IWithdrawalRepository } from "@domain/interfaces/repositories/IWithdrawalRepository";
import { IGetWithdrawalsUseCase } from "@domain/interfaces/useCases/admin/finance/withdrawal/IGetWithdrawalsUseCase";
import { GetWithdrawalsRequestDTO } from "application/dto/wallet/getWithdrawalsDTO";
import { WithdrawalMapper } from "application/mappers/withdrawalMapper";

export class GetWithdrawaluseCase implements IGetWithdrawalsUseCase {
  constructor(private _withdrawalRepo: IWithdrawalRepository) {}

  async execute(dto: GetWithdrawalsRequestDTO) {
    const { page, limit, status, projectId } = dto;

    const skip = (page - 1) * limit;

    const filter: Partial<WithdrawalEntity> = {};

    if (status) filter.status = status as WithdrawalStatus;
    if (projectId) filter.projectId = projectId;

    const data = await this._withdrawalRepo.findAllPaginated(filter, skip, limit);

    const total = await this._withdrawalRepo.count(undefined, undefined, filter);

    return {
      data: data.map(WithdrawalMapper.toListDTO),
      total,
      page,
      limit,
    };
  }
}

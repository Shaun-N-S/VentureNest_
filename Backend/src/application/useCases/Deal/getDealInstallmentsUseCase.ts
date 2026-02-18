import { IGetDealInstallmentsUseCase } from "@domain/interfaces/useCases/deal/IGetDealInstallmentsUseCase";
import { IDealRepository } from "@domain/interfaces/repositories/IDealRepository";
import { IDealInstallmentRepository } from "@domain/interfaces/repositories/IDealInstallmentRepository";
import { NotFoundExecption, ForbiddenException } from "application/constants/exceptions";
import { DEAL_ERRORS } from "@shared/constants/error";
import { UserRole } from "@domain/enum/userRole";
import { DealInstallmentMapper } from "application/mappers/dealInstallmentMapper";
import { DealInstallmentDTO } from "application/dto/deal/dealDetailsResponseDTO";

export class GetDealInstallmentsUseCase implements IGetDealInstallmentsUseCase {
  constructor(
    private _dealRepo: IDealRepository,
    private _installmentRepo: IDealInstallmentRepository
  ) {}

  async execute(userId: string, role: UserRole, dealId: string): Promise<DealInstallmentDTO[]> {
    const deal = await this._dealRepo.findById(dealId);

    if (!deal) {
      throw new NotFoundExecption(DEAL_ERRORS.DEAL_NOT_FOUND);
    }

    // Access Control
    if (deal.investorId !== userId && deal.founderId !== userId) {
      throw new ForbiddenException(DEAL_ERRORS.UNAUTHORIZED_DEAL_ACCESS);
    }

    const installments = await this._installmentRepo.findByDealId(dealId);

    return installments.map(DealInstallmentMapper.toResponseDTO);
  }
}

import { IGetMyDealsUseCase } from "@domain/interfaces/useCases/deal/IGetMyDealsUseCase";
import { IDealRepository } from "@domain/interfaces/repositories/IDealRepository";
import { DealResponseDTO } from "application/dto/deal/dealResponseDTO";
import { DealMapper } from "application/mappers/dealMapper";
import { UserRole } from "@domain/enum/userRole";

export class GetMyDealsUseCase implements IGetMyDealsUseCase {
  constructor(private _dealRepo: IDealRepository) {}

  async execute(userId: string, role: UserRole): Promise<DealResponseDTO[]> {
    let deals;

    if (role === UserRole.INVESTOR) {
      deals = await this._dealRepo.findByInvestorId(userId);
    } else {
      deals = await this._dealRepo.findByFounderId(userId);
    }

    return deals.map((deal) => DealMapper.toResponseDTO(deal));
  }
}

import { IInvestorRepository } from "@domain/interfaces/repositories/IInvestorRespository";
import { IGetAllInvestorUseCase } from "@domain/interfaces/useCases/admin/investor/IGetAllInvestorUseCase";
import { InvestorDTO } from "application/dto/investor/investorDTO";
import { InvestorMapper } from "application/mappers/investorMapper";

export class GetAllInvestorUseCase implements IGetAllInvestorUseCase {
  constructor(private _investorRepository: IInvestorRepository) {}

  async getAllInvestors(
    page: number,
    limit: number,
    status?: string,
    search?: string
  ): Promise<{
    investors: InvestorDTO[];
    totalInvestors: number;
    totalPages: number;
    currentPage: number;
  }> {
    const skip = (page - 1) * limit;

    const [investors, totalInvestors] = await Promise.all([
      this._investorRepository.findAll(skip, limit, status, search),
      this._investorRepository.count(status, search),
    ]);

    const investorDTOs = investors.map((i) => InvestorMapper.toDTO(i));

    return {
      investors: investorDTOs,
      totalInvestors,
      totalPages: Math.ceil(totalInvestors / limit),
      currentPage: page,
    };
  }
}

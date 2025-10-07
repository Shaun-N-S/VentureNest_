import { UserStatus } from "@domain/enum/userStatus";
import { IInvestorRepository } from "@domain/interfaces/repositories/IInvestorRespository";
import { IHashPasswordService } from "@domain/interfaces/services/IHashPasswordService";
import { IInvestorLoginUseCase } from "@domain/interfaces/useCases/auth/investor/IInvestorLoginUseCase";
import { Errors, INVESTOR_ERRORS } from "@shared/constants/error";
import { LoginUserResponseDTO } from "application/dto/auth/LoginUserDTO";
import { InvestorMapper } from "application/mappers/investorMapper";

export class InvestorLoginUseCase implements IInvestorLoginUseCase {
  private _investorRepository;
  private _hashService;

  constructor(investorRepository: IInvestorRepository, hashService: IHashPasswordService) {
    this._investorRepository = investorRepository;
    this._hashService = hashService;
  }

  async investorLogin(email: string, password: string): Promise<LoginUserResponseDTO> {
    const investor = await this._investorRepository.findByEmail(email);

    if (!investor) {
      throw new Error(INVESTOR_ERRORS.INVESTOR_ALREADY_EXISTS);
    }

    if (investor.status === UserStatus.BLOCKED) {
      throw new Error(INVESTOR_ERRORS.INVESTOR_BLOKED);
    }

    const verifyPassword = await this._hashService.compare(password, investor.password);

    if (!verifyPassword) {
      throw new Error(Errors.INVALID_CREDENTIALS);
    }

    const response: LoginUserResponseDTO = InvestorMapper.toLoginInvestorResponse(investor);
    return response;
  }
}

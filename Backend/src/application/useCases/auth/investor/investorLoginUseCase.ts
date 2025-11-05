import { UserStatus } from "@domain/enum/userStatus";
import { IInvestorRepository } from "@domain/interfaces/repositories/IInvestorRespository";
import { IHashPasswordService } from "@domain/interfaces/services/IHashPasswordService";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";
import { IInvestorLoginUseCase } from "@domain/interfaces/useCases/auth/investor/IInvestorLoginUseCase";
import { Errors, INVESTOR_ERRORS } from "@shared/constants/error";
import {
  AlreadyExisitingExecption,
  InvalidDataException,
  IsBlockedExecption,
  NotFoundExecption,
  PasswordNotMatchingException,
} from "application/constants/exceptions";
import { LoginUserResponseDTO } from "application/dto/auth/LoginUserDTO";
import { InvestorMapper } from "application/mappers/investorMapper";

export class InvestorLoginUseCase implements IInvestorLoginUseCase {
  private _investorRepository;
  private _hashService;
  private _storageService;

  constructor(
    investorRepository: IInvestorRepository,
    hashService: IHashPasswordService,
    storageService: IStorageService
  ) {
    this._investorRepository = investorRepository;
    this._hashService = hashService;
    this._storageService = storageService;
  }

  async investorLogin(email: string, password: string): Promise<LoginUserResponseDTO> {
    const investor = await this._investorRepository.findByEmail(email);

    if (!investor) {
      throw new NotFoundExecption(INVESTOR_ERRORS.INVESTOR_NOT_FOUND);
    }

    if (investor.status === UserStatus.BLOCKED) {
      throw new IsBlockedExecption(INVESTOR_ERRORS.INVESTOR_BLOKED);
    }
    if (!investor.password) {
      if (investor.googleId) {
        throw new PasswordNotMatchingException(Errors.INVALID_LOGIN_TYPE);
      }
      throw new PasswordNotMatchingException(Errors.PASSWORD_NOT_MATCHING);
    }

    const verifyPassword = await this._hashService.compare(password, investor.password);

    if (!verifyPassword) {
      throw new InvalidDataException(Errors.INVALID_CREDENTIALS);
    }

    const response: LoginUserResponseDTO = InvestorMapper.toLoginInvestorResponse(investor);
    if (response.profileImg) {
      response.profileImg = await this._storageService.createSignedUrl(
        response.profileImg,
        10 * 60
      );
    }
    console.log(response);
    return response;
  }
}

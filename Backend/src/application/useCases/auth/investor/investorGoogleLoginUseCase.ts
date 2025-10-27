import { PreferredSector } from "@domain/enum/preferredSector";
import { UserRole } from "@domain/enum/userRole";
import { UserStatus } from "@domain/enum/userStatus";
import { IInvestorRepository } from "@domain/interfaces/repositories/IInvestorRespository";
import { IGoogleAuthService } from "@domain/interfaces/services/IGoogleAuthService";
import { IGoogleLoginUseCase } from "@domain/interfaces/useCases/auth/IGoogleLoginUseCase";
import {
  IGoogleLoginRequestDTO,
  IGoogleLoginResponseDTO,
} from "application/dto/auth/googleAuthDTO";
import { InvestorMapper } from "application/mappers/investorMapper";

export class InvestorGoogleLoginUseCase implements IGoogleLoginUseCase {
  constructor(
    private _investorRepository: IInvestorRepository,
    private _googleAuthService: IGoogleAuthService
  ) {}

  async execute({
    authorizationCode,
    role,
  }: IGoogleLoginRequestDTO): Promise<IGoogleLoginResponseDTO> {
    const { email, googleId, userName, profileImage } =
      await this._googleAuthService.authorize(authorizationCode);

    let investor = await this._investorRepository.findByEmail(email);

    if (!investor) {
      investor = {
        email,
        userName,
        isFirstLogin: true,
        adminVerified: false,
        role: UserRole.INVESTOR,
        interestedTopics: [],
        status: UserStatus.ACTIVE,
        location: "",
        companyName: "",
        experience: 0,
        preferredSector: [],
        preferredStartupStage: [],
        investmentMin: 0,
        investmentMax: 0,
        portfolioPdf: "",
        googleId: googleId,
        profileImg: profileImage,
      };

      const id = await this._investorRepository.googleSignUp(investor);
      investor._id = id;
    }
    return InvestorMapper.toLoginInvestorResponse(investor);
  }
}

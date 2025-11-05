import { PreferredSector } from "@domain/enum/preferredSector";
import { StorageFolderNames } from "@domain/enum/storageFolderNames";
import { UserRole } from "@domain/enum/userRole";
import { UserStatus } from "@domain/enum/userStatus";
import { IInvestorRepository } from "@domain/interfaces/repositories/IInvestorRespository";
import { IGoogleAuthService } from "@domain/interfaces/services/IGoogleAuthService";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";
import { IGoogleLoginUseCase } from "@domain/interfaces/useCases/auth/IGoogleLoginUseCase";
import { fetchImageAsBuffer } from "@shared/utils/fetchImageAsBuffer";
import {
  IGoogleLoginRequestDTO,
  IGoogleLoginResponseDTO,
} from "application/dto/auth/googleAuthDTO";
import { InvestorMapper } from "application/mappers/investorMapper";

export class InvestorGoogleLoginUseCase implements IGoogleLoginUseCase {
  constructor(
    private _investorRepository: IInvestorRepository,
    private _googleAuthService: IGoogleAuthService,
    private _storageService: IStorageService
  ) {}

  async execute({
    authorizationCode,
    role,
  }: IGoogleLoginRequestDTO): Promise<IGoogleLoginResponseDTO> {
    const { email, googleId, userName, profileImage } =
      await this._googleAuthService.authorize(authorizationCode);

    let investor = await this._investorRepository.findByEmail(email);

    let profileImageKey = investor?.profileImg || "";

    if (!investor) {
      if (profileImage) {
        const imageBuffer = await fetchImageAsBuffer(profileImage);
        profileImageKey = await this._storageService.upload(
          imageBuffer,
          StorageFolderNames.PROFILE_IMAGE + "/" + googleId + Date.now()
        );
      }

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
        profileImg: profileImageKey,
      };

      const id = await this._investorRepository.googleSignUp(investor);
      investor._id = id;
      const profileKey = profileImageKey || investor.profileImg;
      investor.profileImg = await this._storageService.createSignedUrl(profileKey!, 10 * 60);
    }
    return InvestorMapper.toLoginInvestorResponse(investor);
  }
}

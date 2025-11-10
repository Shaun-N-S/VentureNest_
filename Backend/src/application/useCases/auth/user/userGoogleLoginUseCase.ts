import { KYCStatus } from "@domain/enum/kycStatus";
import { StorageFolderNames } from "@domain/enum/storageFolderNames";
import { UserRole } from "@domain/enum/userRole";
import { UserStatus } from "@domain/enum/userStatus";
import { IUserRepository } from "@domain/interfaces/repositories/IUserRepository";
import { IGoogleAuthService } from "@domain/interfaces/services/IGoogleAuthService";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";
import { IGoogleLoginUseCase } from "@domain/interfaces/useCases/auth/IGoogleLoginUseCase";
import { fetchImageAsBuffer } from "@shared/utils/fetchImageAsBuffer";
import {
  IGoogleLoginRequestDTO,
  IGoogleLoginResponseDTO,
} from "application/dto/auth/googleAuthDTO";
import { UserMapper } from "application/mappers/userMappers";

export class UserGoogleLoginUseCase implements IGoogleLoginUseCase {
  constructor(
    private _userRepository: IUserRepository,
    private _googleAuthService: IGoogleAuthService,
    private _storageService: IStorageService
  ) {}

  async execute({
    authorizationCode,
    role,
  }: IGoogleLoginRequestDTO): Promise<IGoogleLoginResponseDTO> {
    const { email, googleId, userName, profileImage } =
      await this._googleAuthService.authorize(authorizationCode);

    let user = await this._userRepository.findByEmail(email);

    let profileImageKey = user?.profileImg || "";
    if (!user) {
      if (profileImage) {
        const imageBuffer = await fetchImageAsBuffer(profileImage);
        profileImageKey = await this._storageService.upload(
          imageBuffer,
          StorageFolderNames.PROFILE_IMAGE + "/" + googleId + Date.now()
        );
      }

      user = {
        email,
        userName,
        isFirstLogin: true,
        adminVerified: false,
        kycStatus: KYCStatus.PENDING,
        role: UserRole.USER,
        interestedTopics: [],
        status: UserStatus.ACTIVE,
        googleId: googleId,
        profileImg: profileImageKey,
      };
      const id = await this._userRepository.googleSignUp(user);
      user._id = id;
      const profileKey = profileImageKey || user.profileImg;
      user.profileImg = await this._storageService.createSignedUrl(profileKey!, 10 * 60);
    }
    return UserMapper.toLoginUserResponse(user);
  }
}

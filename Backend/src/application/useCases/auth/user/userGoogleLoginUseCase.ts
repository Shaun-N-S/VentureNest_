import { UserRole } from "@domain/enum/userRole";
import { UserStatus } from "@domain/enum/userStatus";
import { IUserRepository } from "@domain/interfaces/repositories/IUserRepository";
import { IGoogleAuthService } from "@domain/interfaces/services/IGoogleAuthService";
import { IGoogleLoginUseCase } from "@domain/interfaces/useCases/auth/IGoogleLoginUseCase";
import {
  IGoogleLoginRequestDTO,
  IGoogleLoginResponseDTO,
} from "application/dto/auth/googleAuthDTO";
import { UserMapper } from "application/mappers/userMappers";

export class UserGoogleLoginUseCase implements IGoogleLoginUseCase {
  constructor(
    private _userRepository: IUserRepository,
    private _googleAuthService: IGoogleAuthService
  ) {}

  async execute({
    authorizationCode,
    role,
  }: IGoogleLoginRequestDTO): Promise<IGoogleLoginResponseDTO> {
    const { email, googleId, userName, profileImage } =
      await this._googleAuthService.authorize(authorizationCode);

    let user = await this._userRepository.findByEmail(email);

    if (!user) {
      user = {
        email,
        userName,
        isFirstLogin: true,
        adminVerified: false,
        role: UserRole.USER,
        interestedTopics: [],
        status: UserStatus.ACTIVE,
        googleId: googleId,
        profileImg: profileImage,
      };
      const id = await this._userRepository.googleSignUp(user);
      user._id = id;
    }
    return UserMapper.toLoginUserResponse(user);
  }
}

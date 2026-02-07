import { IInvestorRepository } from "@domain/interfaces/repositories/IInvestorRespository";
import { IUserRepository } from "@domain/interfaces/repositories/IUserRepository";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";
import { IGetProfileImg } from "@domain/interfaces/useCases/auth/IGetProfileImg";
import { USER_ERRORS } from "@shared/constants/error";
import { NotFoundExecption } from "application/constants/exceptions";
import { ProfileImgDTO } from "application/dto/auth/LoginUserDTO";

export class GetProfileImgUseCase implements IGetProfileImg {
  constructor(
    private _userRepository: IUserRepository,
    private _investorRepository: IInvestorRepository,
    private _storageService: IStorageService
  ) {}

  async getProfile(id: string): Promise<ProfileImgDTO> {
    const [userData, investorData] = await Promise.all([
      this._userRepository.findById(id),
      this._investorRepository.findById(id),
    ]);

    if (!userData && !investorData) {
      throw new NotFoundExecption(USER_ERRORS.NO_USERS_FOUND);
    }

    const profileKey = userData?.profileImg || investorData?.profileImg || "";

    if (!profileKey) {
      throw new NotFoundExecption(USER_ERRORS.NO_PROFILE_FOUND);
    }

    const signedUrl = await this._storageService.createSignedUrl(profileKey, 10 * 60);

    return { profileImg: signedUrl };
  }
}

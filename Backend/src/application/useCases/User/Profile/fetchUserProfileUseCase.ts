import { IUserRepository } from "@domain/interfaces/repositories/IUserRepository";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";
import { IFetchUserProfileUseCase } from "@domain/interfaces/useCases/user/profile/IFetchUserProfileUseCase";
import { USER_ERRORS } from "@shared/constants/error";
import { NotFoundExecption } from "application/constants/exceptions";
import { UserProfileUpdateResDTO } from "application/dto/user/userProfileUpdateDTO";
import { UserMapper } from "application/mappers/userMappers";

export class FetchUserProfileUseCase implements IFetchUserProfileUseCase {
  constructor(
    private _userRepository: IUserRepository,
    private _storageService: IStorageService
  ) {}

  async fetchUserProfile(id: string): Promise<UserProfileUpdateResDTO> {
    const user = await this._userRepository.findById(id);
    console.log("user data from useCase : : : ", user);

    if (!user) {
      throw new NotFoundExecption(USER_ERRORS.NO_USERS_FOUND);
    }

    const profileData: UserProfileUpdateResDTO = UserMapper.userProfileData(user);
    if (profileData.profileImg) {
      profileData.profileImg = await this._storageService.createSignedUrl(
        profileData.profileImg,
        10 * 60
      );
    } else {
      profileData.profileImg = "";
    }
    console.log("user detaild fetchedd data of usecase : :   :", profileData);
    return profileData;
  }
}

import { UserEntity } from "@domain/entities/user/userEntity";
import { StorageFolderNames } from "@domain/enum/storageFolderNames";
import { IUserRepository } from "@domain/interfaces/repositories/IUserRepository";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";
import { IUpdateUserProfileUseCase } from "@domain/interfaces/useCases/user/profile/IUpdateUserProfileUseCase";
import { USER_ERRORS } from "@shared/constants/error";
import { NotFoundExecption } from "application/constants/exceptions";
import {
  UserProfileUpdateReqDTO,
  UserProfileUpdateResDTO,
} from "application/dto/user/userProfileUpdateDTO";
import { UserMapper } from "application/mappers/userMappers";

export class UpdateUserProfileUseCase implements IUpdateUserProfileUseCase {
  constructor(
    private _userRepository: IUserRepository,
    private _storageService: IStorageService
  ) {}

  async updateUserProfile(data: UserProfileUpdateReqDTO): Promise<UserProfileUpdateResDTO | null> {
    const { id, formData, profileImg } = data;
    console.log(
      "data reached on backend ID",
      id,
      "formdata : : ,",
      formData,
      "profielIMg : : : ,",
      profileImg
    );

    const user = await this._userRepository.findById(id);

    if (!user) {
      throw new Error(USER_ERRORS.NO_USERS_FOUND);
    }

    let profileImgKey = user.profileImg || "";

    if (profileImg) {
      profileImgKey = await this._storageService.upload(
        profileImg,
        StorageFolderNames.PROFILE_IMAGE + "/" + id + Date.now()
      );
    }

    const updatedData = {
      ...formData,
      profileImg: profileImgKey ?? "",
      updatedAt: new Date(),
    };

    console.log("update user data :: :   ,", updatedData);

    const updatedUser = await this._userRepository.update(id, updatedData);

    if (!updatedUser) {
      throw new NotFoundExecption(USER_ERRORS.NO_USERS_FOUND);
    }

    const response: UserProfileUpdateResDTO = UserMapper.userProfileUpdateRes(updatedUser);
    response.profileImg = await this._storageService.createSignedUrl(profileImgKey, 10 * 60);
    return response;
  }
}

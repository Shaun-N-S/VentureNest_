import {
  UserProfileUpdateReqDTO,
  UserProfileUpdateResDTO,
} from "application/dto/user/userProfileUpdateDTO";

export interface IUpdateUserProfileUseCase {
  updateUserProfile(data: UserProfileUpdateReqDTO): Promise<UserProfileUpdateResDTO | null>;
}

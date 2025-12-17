import { UserProfileUpdateResDTO } from "application/dto/user/userProfileUpdateDTO";

export interface IFetchUserProfileUseCase {
  fetchUserProfile(id: string): Promise<UserProfileUpdateResDTO>;
}

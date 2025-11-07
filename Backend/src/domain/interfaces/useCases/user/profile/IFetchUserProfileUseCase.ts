import { UserEntity } from "@domain/entities/user/userEntity";
import {
  UserProfileUpdateDTO,
  UserProfileUpdateResDTO,
} from "application/dto/user/userProfileUpdateDTO";

export interface IFetchUserProfileUseCase {
  fetchUserProfile(id: string): Promise<UserProfileUpdateResDTO>;
}

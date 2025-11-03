import { ProfileImgDTO } from "application/dto/auth/LoginUserDTO";

export interface IGetProfileImg {
  getProfile(id: string): Promise<ProfileImgDTO>;
}

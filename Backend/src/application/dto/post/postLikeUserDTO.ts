import { UserRole } from "@domain/enum/userRole";

export interface PostLikeUserDTO {
  id: string;
  name: string;
  bio?: string;
  profileImg?: string;
  role: UserRole;
}

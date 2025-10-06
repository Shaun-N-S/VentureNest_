import { UserRole } from "@domain/enum/userRole";
import { UserStatus } from "@domain/enum/userStatus";

export interface UserDTO {
  _id: string;
  userName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  isFirstLogin: boolean;
  adminVerified: boolean;
  profileImg?: string;
  updatedAt: Date;
  createdAt: Date;
}

import { UserRole } from "@domain/enum/userRole";
import { UserStatus } from "@domain/enum/userStatus";

export interface LoginUserDTO {
  _id: string;
  userName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  isFirstLogin: boolean;
  updatedAt: Date;
}

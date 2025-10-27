import { UserRole } from "@domain/enum/userRole";

export interface IGoogleLoginRequestDTO {
  authorizationCode: string;
  role: UserRole;
}

export interface IGoogleLoginResponseDTO {
  email: string;
  userName: string;
  _id: string;
  role: UserRole;
  profileImg: string;
}

import { UserRole } from "domain/enum/userRole";

export interface CreateUserDTO {
  userName: string;
  email: string;
  password: string;
  // role: UserRole;
}

// export interface CreateUserResponseDTO {
//   success: boolean;
// }

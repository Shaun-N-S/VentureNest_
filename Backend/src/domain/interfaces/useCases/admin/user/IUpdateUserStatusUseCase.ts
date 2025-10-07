import { UserStatus } from "@domain/enum/userStatus";
import { UserDTO } from "application/dto/user/userDTO";

export interface IUpdateUserStatusUseCase {
  updateUserStatus(userId: string, currentStatus: UserStatus): Promise<{ user: UserDTO }>;
}

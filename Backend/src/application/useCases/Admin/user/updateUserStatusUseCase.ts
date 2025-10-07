import { UserStatus } from "@domain/enum/userStatus";
import { IUserRepository } from "@domain/interfaces/repositories/IUserRepository";
import { IUpdateUserStatusUseCase } from "@domain/interfaces/useCases/admin/user/IUpdateUserStatusUseCase";
import { USER_ERRORS } from "@shared/constants/error";
import { UserDTO } from "application/dto/user/userDTO";

export class UpdateUserStatusUseCase implements IUpdateUserStatusUseCase {
  constructor(private _userRepository: IUserRepository) {}

  async updateUserStatus(userId: string, currentStatus: UserStatus): Promise<{ user: UserDTO }> {
    const newStatus = currentStatus === UserStatus.ACTIVE ? UserStatus.BLOCKED : UserStatus.ACTIVE;

    const updatedUser = await this._userRepository.updateStatus(userId, newStatus);

    if (!updatedUser) throw new Error(USER_ERRORS.USER_NOT_FOUND);

    return { user: updatedUser };
  }
}

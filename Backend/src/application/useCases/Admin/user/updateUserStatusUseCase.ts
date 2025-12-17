import { UserRole } from "@domain/enum/userRole";
import { UserStatus } from "@domain/enum/userStatus";
import { IUserRepository } from "@domain/interfaces/repositories/IUserRepository";
import { IKeyValueTTLCaching } from "@domain/interfaces/services/ICache/IKeyValueTTLCaching";
import { IUpdateUserStatusUseCase } from "@domain/interfaces/useCases/admin/user/IUpdateUserStatusUseCase";
import { USER_ERRORS } from "@shared/constants/error";
import { NotFoundExecption } from "application/constants/exceptions";
import { UserDTO } from "application/dto/user/userDTO";

export class UpdateUserStatusUseCase implements IUpdateUserStatusUseCase {
  constructor(
    private _userRepository: IUserRepository,
    private _cacheService: IKeyValueTTLCaching
  ) {}

  async updateUserStatus(userId: string, currentStatus: UserStatus): Promise<{ user: UserDTO }> {
    const newStatus = currentStatus === UserStatus.ACTIVE ? UserStatus.BLOCKED : UserStatus.ACTIVE;

    const updatedUser = await this._userRepository.updateStatus(userId, newStatus);

    if (!updatedUser) throw new NotFoundExecption(USER_ERRORS.USER_NOT_FOUND);

    await this._cacheService.deleteData(`USER_STATUS:${UserRole.USER}:${userId}`);

    return { user: updatedUser as UserDTO };
  }
}

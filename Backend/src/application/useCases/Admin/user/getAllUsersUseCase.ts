import { IUserRepository } from "@domain/interfaces/repositories/IUserRepository";
import { IGetAllUsersUseCase } from "@domain/interfaces/useCases/admin/user/IGetAllUsersUseCase";
import { UserDTO } from "application/dto/user/userDTO";
import { UserMapper } from "application/mappers/userMappers";

export class GetAllUsersUseCase implements IGetAllUsersUseCase {
  constructor(private _userRepository: IUserRepository) {}

  async getAllUser(
    page: number,
    limit: number,
    status?: string,
    search?: string
  ): Promise<{ users: UserDTO[]; totalUsers: number; totalPages: number; currentPage: number }> {
    const skip = (page - 1) * limit;

    const [users, totalUsers] = await Promise.all([
      this._userRepository.findAll(skip, limit, status, search),
      this._userRepository.count(status, search),
    ]);

    const userDTOs = users.map((user) => UserMapper.toDTO(user));

    return {
      users: userDTOs,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
    };
  }
}

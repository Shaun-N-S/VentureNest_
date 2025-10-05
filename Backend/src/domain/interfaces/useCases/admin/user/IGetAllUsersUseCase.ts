import { UserDTO } from "application/dto/user/userDTO";

export interface IGetAllUsersUseCase {
  getAllUser(
    page: number,
    limit: number
  ): Promise<{ users: UserDTO[]; totalUsers: number; totalPages: number; currentPage: number }>;
}

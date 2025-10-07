import { UserDTO } from "application/dto/user/userDTO";

export interface IGetAllUsersUseCase {
  getAllUser(
    page: number,
    limit: number,
    status?: string,
    search?: string
  ): Promise<{ users: UserDTO[]; totalUsers: number; totalPages: number; currentPage: number }>;
}

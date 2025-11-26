import { NetworkUsersDTO } from "application/dto/relationship/relationshipDTO";

export interface IGetNetworkUsersUseCase {
  execute(
    page: number,
    limit: number,
    search?: string,
    currentUserId?: string
  ): Promise<{
    users: NetworkUsersDTO[];
    totalUsers: number;
    totalPages: number;
    currentPage: number;
  }>;
}

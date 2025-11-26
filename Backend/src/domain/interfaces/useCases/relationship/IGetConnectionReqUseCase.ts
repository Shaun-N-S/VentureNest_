import { NetworkUsersDTO } from "application/dto/relationship/relationshipDTO";

export interface IGetConnectionReqUseCase {
  execute(
    userId: string,
    page: number,
    limit: number
  ): Promise<{
    users: NetworkUsersDTO[];
    totalUsers: number;
    totalPages: number;
    currentPage: number;
  }>;
}

import { NetworkUsersDTO } from "application/dto/relationship/relationshipDTO";

export interface IGetConnectionsPeopleListUseCase {
  execute(
    userId: string,
    page: number,
    limit: number,
    search?: string
  ): Promise<{
    users: NetworkUsersDTO[];
    totalUsers: number;
    totalPages: number;
    currentPage: number;
  }>;
}

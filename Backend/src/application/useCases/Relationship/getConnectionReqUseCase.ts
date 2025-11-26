import { ConnectionStatus } from "@domain/enum/connectionStatus";
import { IInvestorRepository } from "@domain/interfaces/repositories/IInvestorRespository";
import { IRelationshipRepository } from "@domain/interfaces/repositories/IRelationshipRepository";
import { IUserRepository } from "@domain/interfaces/repositories/IUserRepository";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";
import { IGetConnectionReqUseCase } from "@domain/interfaces/useCases/relationship/IGetConnectionReqUseCase";
import { NetworkUsersDTO } from "application/dto/relationship/relationshipDTO";
import { RelationshipMapper } from "application/mappers/relationshipMapper";

export class GetConnectionReqUseCase implements IGetConnectionReqUseCase {
  constructor(
    private _relationshipRepo: IRelationshipRepository,
    private _userRepo: IUserRepository,
    private _investorRepo: IInvestorRepository,
    private _storageService: IStorageService
  ) {}

  async execute(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    users: NetworkUsersDTO[];
    totalUsers: number;
    totalPages: number;
    currentPage: number;
  }> {
    const allRequests = await this._relationshipRepo.findPendingRequests(userId);
    const totalUsers = allRequests.length;

    const startIndex = (page - 1) * limit;
    const paginatedRequests = allRequests.slice(startIndex, startIndex + limit);

    const users = await Promise.all(
      paginatedRequests.map(async (req) => {
        const sender =
          (await this._userRepo.findById(req.fromUserId)) ||
          (await this._investorRepo.findById(req.fromUserId));
        if (!sender) return null;

        console.log("sender data from usecase  :  ", sender);
        const dto = RelationshipMapper.NetworkUsers(sender, sender.role, ConnectionStatus.PENDING);

        if (dto.profileImg) {
          dto.profileImg = await this._storageService.createSignedUrl(dto.profileImg, 600);
        }

        return dto;
      })
    );
    console.log("users data useCase  :  ", users);

    const filtered = users.filter((u): u is NetworkUsersDTO => u !== null);
    console.log("filtered data from useCase    :  ", filtered);
    return {
      users: filtered,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
    };
  }
}

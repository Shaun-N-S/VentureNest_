import { CONFIG } from "@config/config";
import { ConnectionStatus } from "@domain/enum/connectionStatus";
import { IInvestorRepository } from "@domain/interfaces/repositories/IInvestorRespository";
import { IRelationshipRepository } from "@domain/interfaces/repositories/IRelationshipRepository";
import { IUserRepository } from "@domain/interfaces/repositories/IUserRepository";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";
import { IGetConnectionsPeopleListUseCase } from "@domain/interfaces/useCases/relationship/IGetConnectionsPeopleListUseCase ";
import { RelationshipMapper } from "application/mappers/relationshipMapper";

export class GetConnectionsPeopleListUseCase implements IGetConnectionsPeopleListUseCase {
  constructor(
    private readonly _relationshipRepository: IRelationshipRepository,
    private readonly _userRepository: IUserRepository,
    private readonly _investorRepository: IInvestorRepository,
    private readonly _storageService: IStorageService
  ) {}

  async execute(userId: string, page: number, limit: number, search?: string) {
    const skip = (page - 1) * limit;

    const connections = await this._relationshipRepository.findConnections(userId);

    if (!connections.length) {
      return {
        users: [],
        totalUsers: 0,
        totalPages: 0,
        currentPage: page,
      };
    }

    const connectedIdsSet = new Set<string>();

    for (const connection of connections) {
      if (connection.fromUserId === userId) {
        connectedIdsSet.add(connection.toUserId);
      } else {
        connectedIdsSet.add(connection.fromUserId);
      }
    }

    const connectedIds = Array.from(connectedIdsSet);

    const [users, investors, usersCount, investorsCount] = await Promise.all([
      this._userRepository.findByIdsPaginated(connectedIds, skip, limit, search),
      this._investorRepository.findByIdsPaginated(connectedIds, skip, limit, search),
      this._userRepository.countByIds(connectedIds, search),
      this._investorRepository.countByIds(connectedIds, search),
    ]);

    const mappedUsers = users.map((u) =>
      RelationshipMapper.NetworkUsers(u, u.role, ConnectionStatus.ACCEPTED)
    );

    const mappedInvestors = investors.map((i) =>
      RelationshipMapper.NetworkUsers(i, i.role, ConnectionStatus.ACCEPTED)
    );

    const combinedUsers = [...mappedUsers, ...mappedInvestors];

    const finalUsers = await Promise.all(
      combinedUsers.map(async (dto) => {
        if (dto.profileImg) {
          dto.profileImg = await this._storageService.createSignedUrl(
            dto.profileImg,
            CONFIG.SIGNED_URL_EXPIRY
          );
        }
        return dto;
      })
    );

    const totalUsers = usersCount + investorsCount;

    return {
      users: finalUsers,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
    };
  }
}

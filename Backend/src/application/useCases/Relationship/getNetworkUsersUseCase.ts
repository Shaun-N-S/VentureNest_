import { ConnectionStatus } from "@domain/enum/connectionStatus";
import { UserStatus } from "@domain/enum/userStatus";
import { IInvestorRepository } from "@domain/interfaces/repositories/IInvestorRespository";
import { IRelationshipRepository } from "@domain/interfaces/repositories/IRelationshipRepository";
import { IUserRepository } from "@domain/interfaces/repositories/IUserRepository";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";
import { IGetNetworkUsersUseCase } from "@domain/interfaces/useCases/relationship/IGetNetworkUsersUseCase";
import { RelationshipMapper } from "application/mappers/relationshipMapper";

export class GetNetworkUsersUseCase implements IGetNetworkUsersUseCase {
  constructor(
    private _userRepository: IUserRepository,
    private _investorRepository: IInvestorRepository,
    private _relationshipRepository: IRelationshipRepository,
    private _storageService: IStorageService
  ) {}

  async execute(page: number, limit: number, search?: string, currentUserId?: string) {
    const skip = (page - 1) * limit;

    const [investors, users] = await Promise.all([
      this._investorRepository.findAll(skip, limit, UserStatus.ACTIVE, search),
      this._userRepository.findAll(skip, limit, UserStatus.ACTIVE, search),
    ]);

    const merged = [...investors, ...users];

    const filteredUsers = merged.filter((u) => u._id?.toString() !== currentUserId);

    const results = await Promise.all(
      filteredUsers.map(async (record) => {
        let connectionStatus: ConnectionStatus = ConnectionStatus.NONE;

        if (currentUserId) {
          const relation = await this._relationshipRepository.checkExisting(
            currentUserId,
            record._id!.toString()
          );

          if (relation) {
            connectionStatus = relation.status.toLowerCase() as any;
          }
        }

        const dto = RelationshipMapper.NetworkUsers(record, record.role, connectionStatus);

        if (dto.profileImg) {
          dto.profileImg = await this._storageService.createSignedUrl(dto.profileImg, 600);
        }

        return dto;
      })
    );

    const eligibleUsers = results.filter(
      (user) => user.connectionStatus !== ConnectionStatus.ACCEPTED
    );

    return {
      users: eligibleUsers,
      totalUsers: results.length,
      totalPages: Math.ceil(results.length / limit),
      currentPage: page,
    };
  }
}

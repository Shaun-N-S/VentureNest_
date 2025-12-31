import { ConnectionStatus } from "@domain/enum/connectionStatus";
import { IInvestorRepository } from "@domain/interfaces/repositories/IInvestorRespository";
import { IRelationshipRepository } from "@domain/interfaces/repositories/IRelationshipRepository";
import { IUserRepository } from "@domain/interfaces/repositories/IUserRepository";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";
import { IGetConnectionsPeopleListUseCase } from "@domain/interfaces/useCases/relationship/IGetConnectionsPeopleListUseCase ";
import { RelationshipMapper } from "application/mappers/relationshipMapper";

export class GetConnectionsPeopleListUseCase implements IGetConnectionsPeopleListUseCase {
  constructor(
    private _relationshipRepository: IRelationshipRepository,
    private _userRepository: IUserRepository,
    private _investorRepository: IInvestorRepository,
    private _storageService: IStorageService
  ) {}

  async execute(userId: string, page: number, limit: number, search?: string) {
    const skip = (page - 1) * limit;

    // 1️⃣ Get accepted connections
    const connections = await this._relationshipRepository.findConnections(userId);

    if (!connections.length) {
      return {
        users: [],
        totalUsers: 0,
        totalPages: 0,
        currentPage: page,
      };
    }

    const connectedIds = connections.map((c) =>
      c.fromUserId === userId ? c.toUserId : c.fromUserId
    );

    // 2️⃣ Paginated fetch
    const [users, totalUsers] = await Promise.all([
      this._userRepository.findByIdsPaginated(connectedIds, skip, limit, search),
      this._userRepository.countByIds(connectedIds, search),
    ]);

    // 3️⃣ Map DTOs
    const mapped = await Promise.all(
      users.map(async (user) => {
        const dto = RelationshipMapper.NetworkUsers(user, user.role, ConnectionStatus.ACCEPTED);

        if (dto.profileImg) {
          dto.profileImg = await this._storageService.createSignedUrl(dto.profileImg, 600);
        }

        return dto;
      })
    );

    return {
      users: mapped,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
    };
  }
}

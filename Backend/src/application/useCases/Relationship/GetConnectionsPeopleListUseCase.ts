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

    /**
     * 1️⃣ Fetch all accepted connections
     */
    const connections = await this._relationshipRepository.findConnections(userId);

    if (!connections.length) {
      return {
        users: [],
        totalUsers: 0,
        totalPages: 0,
        currentPage: page,
      };
    }

    /**
     * 2️⃣ Extract UNIQUE connected user IDs
     * (handles A→B and B→A duplicates)
     */
    const connectedIdsSet = new Set<string>();

    for (const c of connections) {
      if (c.fromUserId === userId) {
        connectedIdsSet.add(c.toUserId);
      } else {
        connectedIdsSet.add(c.fromUserId);
      }
    }

    const connectedIds = Array.from(connectedIdsSet);

    /**
     * 3️⃣ Fetch USERS & INVESTORS in parallel
     * (because relationship has no role info)
     */
    const [users, investors] = await Promise.all([
      this._userRepository.findByIds(connectedIds),
      this._investorRepository.findByIds(connectedIds),
    ]);

    /**
     * 4️⃣ Normalize into ONE list
     */
    const combined = [
      ...users.map((u) => RelationshipMapper.NetworkUsers(u, u.role, ConnectionStatus.ACCEPTED)),
      ...investors.map((i) =>
        RelationshipMapper.NetworkUsers(i, i.role, ConnectionStatus.ACCEPTED)
      ),
    ];

    /**
     * 5️⃣ Apply search AFTER merge
     */
    const filtered = search
      ? combined.filter((u) => u.userName?.toLowerCase().includes(search.toLowerCase()))
      : combined;

    /**
     * 6️⃣ Pagination AFTER filtering
     */
    const totalUsers = filtered.length;
    const paginated = filtered.slice(skip, skip + limit);

    /**
     * 7️⃣ Generate signed profile image URLs
     */
    const finalUsers = await Promise.all(
      paginated.map(async (dto) => {
        if (dto.profileImg) {
          dto.profileImg = await this._storageService.createSignedUrl(dto.profileImg, 600);
        }
        return dto;
      })
    );

    /**
     * 8️⃣ Final response
     */
    return {
      users: finalUsers,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
    };
  }
}

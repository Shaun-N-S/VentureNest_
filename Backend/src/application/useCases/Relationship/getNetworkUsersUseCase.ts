import { CONFIG } from "@config/config";
import { ConnectionStatus } from "@domain/enum/connectionStatus";
import { UserStatus } from "@domain/enum/userStatus";
import { IInvestorRepository } from "@domain/interfaces/repositories/IInvestorRespository";
import { IRelationshipRepository } from "@domain/interfaces/repositories/IRelationshipRepository";
import { IUserRepository } from "@domain/interfaces/repositories/IUserRepository";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";
import { IGetNetworkUsersUseCase } from "@domain/interfaces/useCases/relationship/IGetNetworkUsersUseCase";
import { RelationshipMapper } from "application/mappers/relationshipMapper";

export class GetNetworkUsersUseCase implements IGetNetworkUsersUseCase {
  /** Upper bound on rows pulled from each collection for the merge window. */
  private static readonly MAX_MERGE_WINDOW = 2000;

  constructor(
    private _userRepository: IUserRepository,
    private _investorRepository: IInvestorRepository,
    private _relationshipRepository: IRelationshipRepository,
    private _storageService: IStorageService
  ) {}

  async execute(page: number, limit: number, search?: string, currentUserId?: string) {
    const safePage = Math.max(1, Math.trunc(page) || 1);
    const safeLimit = Math.max(1, Math.trunc(limit) || 10);
    const skip = (safePage - 1) * safeLimit;

    /**
     * Users live in two separate collections. To page across them as one
     * ordered list we over-fetch the top rows of each collection (bounded for
     * safety), merge them into a single stream ordered by `createdAt` desc
     * (the same sort each repository applies), then take the requested window.
     * Fetching `skip + limit + 1` from each side keeps the merged prefix
     * correct even after the current user is filtered out of it.
     */
    const windowSize = Math.min(skip + safeLimit + 1, GetNetworkUsersUseCase.MAX_MERGE_WINDOW);

    const [investors, users, investorTotal, userTotal] = await Promise.all([
      this._investorRepository.findAll(0, windowSize, UserStatus.ACTIVE, search),
      this._userRepository.findAll(0, windowSize, UserStatus.ACTIVE, search),
      this._investorRepository.count(undefined, search, { status: UserStatus.ACTIVE }),
      this._userRepository.count(undefined, search, { status: UserStatus.ACTIVE }),
    ]);

    const mergedSorted = [...investors, ...users].sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    });

    const pageRecords = mergedSorted
      .filter((u) => u._id?.toString() !== currentUserId)
      .slice(skip, skip + safeLimit);

    const results = await Promise.all(
      pageRecords.map(async (record) => {
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
          dto.profileImg = await this._storageService.createSignedUrl(
            dto.profileImg,
            CONFIG.SIGNED_URL_EXPIRY
          );
        }

        return dto;
      })
    );

    // The signed-in viewer is always a member of one of these collections, so
    // discount them from the totals to match the self-filtered result list.
    const totalUsers = Math.max(0, investorTotal + userTotal - (currentUserId ? 1 : 0));

    return {
      users: results,
      totalUsers,
      totalPages: Math.ceil(totalUsers / safeLimit),
      currentPage: safePage,
    };
  }
}

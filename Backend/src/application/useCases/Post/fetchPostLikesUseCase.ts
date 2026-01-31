import { IUserRepository } from "@domain/interfaces/repositories/IUserRepository";
import { IInvestorRepository } from "@domain/interfaces/repositories/IInvestorRespository";
import { IPostRepository } from "@domain/interfaces/repositories/IPostRepository";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";
import { IFetchPostLikesUseCase } from "@domain/interfaces/useCases/post/IFetchPostLikesUseCase";
import { PostMapper } from "application/mappers/postMapper";

export class FetchPostLikesUseCase implements IFetchPostLikesUseCase {
  constructor(
    private _postRepo: IPostRepository,
    private _userRepo: IUserRepository,
    private _investorRepo: IInvestorRepository,
    private _storageService: IStorageService
  ) {}

  async execute(postId: string, page: number, limit: number, search?: string) {
    const { userIds, investorIds } = await this._postRepo.getPostLikeIds(postId);

    const skip = (page - 1) * limit;

    const [users, investors] = await Promise.all([
      userIds.length ? this._userRepo.findByIdsPaginated(userIds, skip, limit, search) : [],
      investorIds.length
        ? this._investorRepo.findByIdsPaginated(investorIds, skip, limit, search)
        : [],
    ]);

    const totalUsers =
      (await this._userRepo.countByIds(userIds, search)) +
      (await this._investorRepo.countByIds(investorIds, search));

    let result = [...users.map(PostMapper.fromUser), ...investors.map(PostMapper.fromInvestor)];

    result = await Promise.all(
      result.map(async (item) => {
        if (item.profileImg) {
          item.profileImg = await this._storageService.createSignedUrl(item.profileImg, 10 * 60);
        }
        return item;
      })
    );

    return {
      users: result,
      hasNextPage: skip + result.length < totalUsers,
    };
  }
}

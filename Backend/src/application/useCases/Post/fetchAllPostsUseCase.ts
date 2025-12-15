import { UserRole } from "@domain/enum/userRole";
import { IInvestorRepository } from "@domain/interfaces/repositories/IInvestorRespository";
import { IPostRepository } from "@domain/interfaces/repositories/IPostRepository";
import { IUserRepository } from "@domain/interfaces/repositories/IUserRepository";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";
import { IFetchAllPostsUseCase } from "@domain/interfaces/useCases/post/IFetchAllPosts";
import { PostFeedResDTO } from "application/dto/post/postDTO";
import { PostMapper } from "application/mappers/postMapper";

export class FetchAllPostsUseCase implements IFetchAllPostsUseCase {
  constructor(
    private _postRepository: IPostRepository,
    private _userRepository: IUserRepository,
    private _investorRepository: IInvestorRepository,
    private _storageService: IStorageService
  ) {}

  async fetchAllPosts(currentUserId: string, page: number, limit: number) {
    const user = await this._userRepository.findById(currentUserId);
    const interests = user?.interestedTopics || [];

    // PRIORITY 1 — Authors sharing interests
    const authorInterestPosts =
      await this._postRepository.findPostsByAuthorsWithCommonInterests(interests);

    // PRIORITY 2 — Content matches user's interests
    const contentInterestPosts = await this._postRepository.findPostsMatchingInterests(interests);

    // PRIORITY 3 — Latest fallback posts
    const { posts: fallbackPosts } = await this._postRepository.findAllPosts(0, limit * 4);

    // MERGE + REMOVE DUPLICATES
    const merged = [
      ...authorInterestPosts,
      ...contentInterestPosts.filter((p) => !authorInterestPosts.some((x) => x._id === p._id)),
      ...fallbackPosts.filter(
        (p) =>
          !authorInterestPosts.some((x) => x._id === p._id) &&
          !contentInterestPosts.some((x) => x._id === p._id)
      ),
    ];

    // PAGINATION AFTER MERGE
    const start = (page - 1) * limit;
    const end = page * limit;
    const pageData = merged.slice(start, end);

    // FETCH AUTHOR DETAILS
    const userIds: string[] = [];
    const investorIds: string[] = [];

    pageData.forEach((post) => {
      if (post.authorRole === UserRole.USER) userIds.push(post.authorId);
      else investorIds.push(post.authorId);
    });

    const [users, investors] = await Promise.all([
      userIds.length ? this._userRepository.findByIds(userIds) : [],
      investorIds.length ? this._investorRepository.findByIds(investorIds) : [],
    ]);

    const userMap = new Map(users.map((u) => [u._id!, u]));
    const investorMap = new Map(investors.map((i) => [i._id!, i]));

    // BUILD FEED DTOs
    const result = await Promise.all(
      pageData.map(async (post) => {
        const dto = PostMapper.toDTO(post) as PostFeedResDTO;

        dto.liked = post.likes.some((l) => l.likerId === currentUserId);

        // Signed media URLs
        if (post.mediaUrls?.length) {
          dto.mediaUrls = await Promise.all(
            post.mediaUrls.map((url) => this._storageService.createSignedUrl(url, 600))
          );
        }

        // Attach author details
        if (post.authorRole === UserRole.USER) {
          const author = userMap.get(post.authorId);
          dto.authorName = author?.userName || "Unknown User";

          if (author?.profileImg) {
            dto.authorProfileImg = await this._storageService.createSignedUrl(
              author.profileImg,
              600
            );
          }
        } else {
          const investor = investorMap.get(post.authorId);
          dto.authorName = investor?.userName || investor?.companyName || "Investor";

          if (investor?.profileImg) {
            dto.authorProfileImg = await this._storageService.createSignedUrl(
              investor.profileImg,
              600
            );
          }
        }

        return dto;
      })
    );

    return {
      posts: result,
      totalPosts: merged.length,
      hasNextPage: end < merged.length,
    };
  }
}

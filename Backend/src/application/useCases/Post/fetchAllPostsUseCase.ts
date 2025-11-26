import { UserRole } from "@domain/enum/userRole";
import { IInvestorRepository } from "@domain/interfaces/repositories/IInvestorRespository";
import { IPostRepository } from "@domain/interfaces/repositories/IPostRepository";
import { IUserRepository } from "@domain/interfaces/repositories/IUserRepository";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";
import { IFetchAllPostsUseCase } from "@domain/interfaces/useCases/post/IFetchAllPosts";
import { PostFeedResDTO } from "application/dto/post/postDTO";
import { PostMapper } from "application/mappers/postMapper";
import { UserEntity } from "@domain/entities/user/userEntity";
import { InvestorEntity } from "@domain/entities/investor/investorEntity";

interface AuthorData {
  name: string;
  profileImg?: string;
}

export class FetchAllPostsUseCase implements IFetchAllPostsUseCase {
  constructor(
    private _postRepository: IPostRepository,
    private _userRepository: IUserRepository,
    private _investorRepository: IInvestorRepository,
    private _storageService: IStorageService
  ) {}

  async fetchAllPosts(
    currentUserId: string,
    page: number,
    limit: number
  ): Promise<{ posts: PostFeedResDTO[]; totalPosts: number; hasNextPage: boolean }> {
    const skip = (page - 1) * limit;

    const {
      posts: allPosts,
      total,
      hasNextPage,
    } = await this._postRepository.findAllPosts(skip, limit);

    let posts: PostFeedResDTO[] = allPosts.map((post) => PostMapper.toDTO(post)) as any;

    // Collect all user and investor IDs
    const userIds: string[] = [];
    const investorIds: string[] = [];

    posts.forEach((post) => {
      if (post.authorRole === UserRole.USER) {
        userIds.push(post.authorId);
      } else {
        investorIds.push(post.authorId);
      }
    });

    console.log("Total posts:", posts.length);
    console.log("User IDs to fetch:", userIds);
    console.log("Investor IDs to fetch:", investorIds);

    // Fetch users and investors in parallel
    const [users, investors] = await Promise.all([
      userIds.length > 0 ? this._userRepository.findByIds(userIds) : Promise.resolve([]),
      investorIds.length > 0
        ? this._investorRepository.findByIds(investorIds)
        : Promise.resolve([]),
    ]);

    console.log("Users fetched:", users.length, users);
    console.log(" Investors fetched:", investors.length, investors);

    const userMap = new Map<string, AuthorData>();
    users.forEach((u: UserEntity) => {
      if (u._id) {
        const authorData: AuthorData = {
          name: u.userName,
        };
        if (u.profileImg) {
          authorData.profileImg = u.profileImg;
        }
        userMap.set(u._id.toString(), authorData);
        console.log(`Added user to map: ${u._id} -> ${u.userName}`);
      }
    });

    const investorMap = new Map<string, AuthorData>();
    investors.forEach((i: InvestorEntity) => {
      if (i._id) {
        const authorData: AuthorData = {
          name: i.userName || i.companyName || "Unknown Investor",
        };
        if (i.profileImg) {
          authorData.profileImg = i.profileImg;
        }
        investorMap.set(i._id.toString(), authorData);
        console.log(` Added investor to map: ${i._id} -> ${authorData.name}`);
      }
    });

    console.log(" UserMap size:", userMap.size);
    console.log(" InvestorMap size:", investorMap.size);

    const urlsToSign = new Set<string>();

    posts.forEach((post) => {
      post.mediaUrls?.forEach((url) => urlsToSign.add(url));

      const authorData =
        post.authorRole === UserRole.USER
          ? userMap.get(post.authorId)
          : investorMap.get(post.authorId);

      console.log(
        ` Post ${post._id}: authorId=${post.authorId}, role=${post.authorRole}, found=${!!authorData}`
      );

      if (authorData?.profileImg) {
        urlsToSign.add(authorData.profileImg);
      }
    });

    // Batch generate signed URLs
    const signedUrlMap = new Map<string, string>();
    await Promise.all(
      Array.from(urlsToSign).map(async (url) => {
        const signedUrl = await this._storageService.createSignedUrl(url, 600);
        signedUrlMap.set(url, signedUrl);
      })
    );

    // Build feed with signed URLs
    const feed: PostFeedResDTO[] = posts.map((post) => {
      const authorData =
        post.authorRole === UserRole.USER
          ? userMap.get(post.authorId)
          : investorMap.get(post.authorId);

      const feedItem: PostFeedResDTO = {
        ...post,
        mediaUrls: post.mediaUrls?.map((url) => signedUrlMap.get(url) || url) || [],
        authorName: authorData?.name || "Unknown User",
      };

      // Add liked flag
      feedItem.liked = post.likes.some((l) => l.likerId === currentUserId);

      if (authorData?.profileImg && signedUrlMap.get(authorData.profileImg)) {
        feedItem.authorProfileImg = signedUrlMap.get(authorData.profileImg);
      }

      return feedItem;
    });

    console.log("Sample feed item:", JSON.stringify(feed[0], null, 2));

    return { posts: feed, totalPosts: total, hasNextPage };
  }
}

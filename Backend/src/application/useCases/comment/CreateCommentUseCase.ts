import { ICreateCommentUseCase } from "@domain/interfaces/useCases/comment/ICreateCommentUseCase";
import { ICommentRepository } from "@domain/interfaces/repositories/ICommentRepository";
import { IPostRepository } from "@domain/interfaces/repositories/IPostRepository";
import { IUserRepository } from "@domain/interfaces/repositories/IUserRepository";
import { IInvestorRepository } from "@domain/interfaces/repositories/IInvestorRespository";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";
import { CommentMapper } from "application/mappers/commentMapper";
import { CreateCommentDTO, CommentFeedDTO } from "application/dto/comment/commentDTO";
import { UserRole } from "@domain/enum/userRole";

export class CreateCommentUseCase implements ICreateCommentUseCase {
  constructor(
    private _commentRepository: ICommentRepository,
    private _postRepository: IPostRepository,
    private _userRepository: IUserRepository,
    private _investorRepository: IInvestorRepository,
    private _storageService: IStorageService
  ) {}

  async addComment(data: CreateCommentDTO): Promise<CommentFeedDTO> {
    const entity = CommentMapper.createToEntity(data);
    const saved = await this._commentRepository.save(entity);

    await this._postRepository.update(saved.postId, {
      $inc: { commentsCount: 1 },
    } as any);

    const user =
      saved.userRole === UserRole.USER
        ? await this._userRepository.findById(saved.userId)
        : await this._investorRepository.findById(saved.userId);

    const dto = CommentMapper.toFeedDTO({
      ...saved,
      user: user || undefined,
    } as any);

    if (dto.userProfileImg) {
      dto.userProfileImg = await this._storageService.createSignedUrl(dto.userProfileImg, 600);
    }

    return dto;
  }
}

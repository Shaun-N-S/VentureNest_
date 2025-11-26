import { UserRole } from "@domain/enum/userRole";
import { ICommentRepository } from "@domain/interfaces/repositories/ICommentRepository";
import { IInvestorRepository } from "@domain/interfaces/repositories/IInvestorRespository";
import { IReplyRepository } from "@domain/interfaces/repositories/IReplyRepository";
import { IUserRepository } from "@domain/interfaces/repositories/IUserRepository";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";
import { ICreateReplyUseCase } from "@domain/interfaces/useCases/reply/ICreateReplyUseCase";
import { CreateReplyDTO, ReplyFeedDTO } from "application/dto/reply/replyDTO";
import { ReplyMapper } from "application/mappers/replyMapper";
import { PopulatedReply } from "application/type/populatedReply.type";

export class CreateReplyUseCase implements ICreateReplyUseCase {
  constructor(
    private _replyRepository: IReplyRepository,
    private _userRepository: IUserRepository,
    private _investorRepository: IInvestorRepository,
    private _commentRepository: ICommentRepository,
    private _storageService: IStorageService
  ) {}

  async addReply(data: CreateReplyDTO): Promise<ReplyFeedDTO> {
    const entity = ReplyMapper.createToEntity(data);

    const saved = await this._replyRepository.save(entity);

    await this._commentRepository.update(saved.commentId, {
      $inc: { repliesCount: 1 },
    } as any);

    const user =
      saved.replierRole === UserRole.USER
        ? await this._userRepository.findById(saved.replierId)
        : await this._investorRepository.findById(saved.replierId);

    const populatedReply: PopulatedReply = {
      ...(saved as any),
      user: user
        ? { userName: user.userName, profileImg: user.profileImg }
        : { userName: "Unknown", profileImg: "" },
    };

    const dto = ReplyMapper.toFeedDTO(populatedReply);

    if (dto.replierProfileImg) {
      dto.replierProfileImg = await this._storageService.createSignedUrl(
        dto.replierProfileImg,
        600
      );
    }

    return dto;
  }
}

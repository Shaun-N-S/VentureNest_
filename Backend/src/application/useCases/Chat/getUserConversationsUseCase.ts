import { IConversationRepository } from "@domain/interfaces/repositories/IConversationRepository";
import { IGetUserConversationsUseCase } from "@domain/interfaces/useCases/chat/IGetUserConversationsUseCase";
import {
  GetUserConversationsReqDTO,
  GetUserConversationsResDTO,
  ConversationListItemDTO,
} from "application/dto/chat/getConversationDTO";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";
import { CONFIG } from "@config/config";

export class GetUserConversationsUseCase implements IGetUserConversationsUseCase {
  constructor(
    private _conversationRepository: IConversationRepository,
    private _storageService: IStorageService
  ) {}

  async execute(data: GetUserConversationsReqDTO): Promise<GetUserConversationsResDTO> {
    const { userId, page, limit } = data;

    const skip = (page - 1) * limit;

    const conversations = await this._conversationRepository.findUserConversations(
      userId,
      skip,
      limit
    );
    console.log("hello conversations :  : ", conversations);
    const total = await this._conversationRepository.countUserConversations(userId);

    const result: ConversationListItemDTO[] = [];

    for (const c of conversations) {
      const other = c.participants.find((p) => p.userId !== userId)!;

      let signedProfileImg: string | undefined;

      if (other.profileImg) {
        signedProfileImg = await this._storageService.createSignedUrl(
          other.profileImg,
          CONFIG.SIGNED_URL_EXPIRY
        );
      }

      result.push({
        id: c._id,
        otherUser: {
          id: other.userId,
          userName: other.userName,
          role: other.role,
          ...(signedProfileImg && { profileImg: signedProfileImg }),
        },
        ...(c.lastMessage && {
          lastMessage: {
            text: c.lastMessage.text,
            sentAt: c.lastMessage.sentAt,
          },
        }),
      });
    }

    console.log(result);

    return {
      conversations: result,
      total,
    };
  }
}

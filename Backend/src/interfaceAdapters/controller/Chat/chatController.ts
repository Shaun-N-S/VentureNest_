import { Request, Response, NextFunction } from "express";
import { ResponseHelper } from "@shared/utils/responseHelper";
import { HTTPSTATUS } from "@shared/constants/httpStatus";
import { InvalidDataException } from "application/constants/exceptions";
import { Errors } from "@shared/constants/error";
import { ICreateConversationUseCase } from "@domain/interfaces/useCases/chat/ICreateConversationUseCase";
import { ISendMessageUseCase } from "@domain/interfaces/useCases/chat/ISendMessageUseCase";
import { IGetUserConversationsUseCase } from "@domain/interfaces/useCases/chat/IGetUserConversationsUseCase";
import { IGetMessagesUseCase } from "@domain/interfaces/useCases/chat/IGetMessagesUseCase";
import { IMarkConversationReadUseCase } from "@domain/interfaces/useCases/chat/IMarkConversationReadUseCase";
import { IGetUnreadCountUseCase } from "@domain/interfaces/useCases/chat/IGetUnreadCountUseCase";
import { MESSAGES } from "@shared/constants/messages";

export class ChatController {
  constructor(
    private _createConversationUseCase: ICreateConversationUseCase,
    private _sendMessageUseCase: ISendMessageUseCase,
    private _getUserConversationsUseCase: IGetUserConversationsUseCase,
    private _getMessagesUseCase: IGetMessagesUseCase,
    private _markConversationReadUseCase: IMarkConversationReadUseCase,
    private _getUnreadCountUseCase: IGetUnreadCountUseCase
  ) {}

  async createConversation(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, role } = res.locals.user;
      const { targetUserId, targetUserRole } = req.body;

      if (!userId || !role || !targetUserId || !targetUserRole) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      const result = await this._createConversationUseCase.execute({
        currentUserId: userId,
        currentUserRole: role,
        targetUserId,
        targetUserRole,
      });

      ResponseHelper.success(res, MESSAGES.CHAT.CONVERSTION_CREATED, result, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, role } = res.locals.user;
      const { conversationId, content, messageType } = req.body;

      if (!userId || !conversationId || !content || !messageType) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      const result = await this._sendMessageUseCase.execute({
        conversationId,
        senderId: userId,
        senderRole: role,
        content,
        messageType,
      });

      ResponseHelper.success(res, MESSAGES.CHAT.MESSAGE_SENT, result, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  async getUserConversations(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = res.locals.user;
      const page = Number(req.query.page || 1);
      const limit = Number(req.query.limit || 20);

      if (!userId) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      const result = await this._getUserConversationsUseCase.execute({
        userId,
        page,
        limit,
      });

      ResponseHelper.success(res, MESSAGES.CHAT.CONVERSATION_FETCHED, result, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  async getMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const { conversationId } = req.params;
      const page = Number(req.query.page || 1);
      const limit = Number(req.query.limit || 30);

      if (!conversationId) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      const result = await this._getMessagesUseCase.execute({
        conversationId,
        page,
        limit,
      });

      ResponseHelper.success(res, MESSAGES.CHAT.MESSAGES_FETCHED, result, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  async markConversationRead(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = res.locals.user;
      const { conversationId } = req.params;

      if (!userId || !conversationId) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      const result = await this._markConversationReadUseCase.execute({
        conversationId,
        userId,
      });

      ResponseHelper.success(
        res,
        MESSAGES.CHAT.CONVERSATIONS_MARKED_AS_READ,
        result,
        HTTPSTATUS.OK
      );
    } catch (error) {
      next(error);
    }
  }

  async getUnreadCount(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = res.locals.user;

      if (!userId) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      const result = await this._getUnreadCountUseCase.execute({
        userId,
      });

      ResponseHelper.success(res, MESSAGES.CHAT.UNREAD_MESSAGE_COUNT, result, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }
}

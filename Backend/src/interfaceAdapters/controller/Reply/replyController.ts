import { ICreateReplyUseCase } from "@domain/interfaces/useCases/reply/ICreateReplyUseCase";
import { IGetReplyUseCase } from "@domain/interfaces/useCases/reply/IGetReplyUseCase";
import { ILikeReplyUseCase } from "@domain/interfaces/useCases/reply/ILikeReplyUseCase";
import { Errors, REPLY_ERRORS } from "@shared/constants/error";
import { HTTPSTATUS } from "@shared/constants/httpStatus";
import { MESSAGES } from "@shared/constants/messages";
import { ResponseHelper } from "@shared/utils/responseHelper";
import { InvalidDataException, NotFoundExecption } from "application/constants/exceptions";
import { NextFunction, Request, Response } from "express";

export class ReplyController {
  constructor(
    private _createReplyUseCase: ICreateReplyUseCase,
    private _getRepliesUseCase: IGetReplyUseCase,
    private _likeReplyUseCase: ILikeReplyUseCase
  ) {}

  async addReply(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const replierId = res.locals?.user?.userId;
      const replierRole = res.locals?.user?.role;
      const commentId = req.params.commentId;
      const { replyText } = req.body;

      if (!commentId || !replyText) {
        throw new NotFoundExecption(REPLY_ERRORS.INVALID_REPLY_DATA);
      }

      const data = await this._createReplyUseCase.addReply({
        commentId,
        replierId,
        replierRole,
        replyText,
      });

      ResponseHelper.success(
        res,
        MESSAGES.REPLY.REPLY_ADDED_SUCCESSFULLY,
        data,
        HTTPSTATUS.CREATED
      );
    } catch (error) {
      next(error);
    }
  }

  async getReplies(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const commentId = req.params.commentId;
      const currentUserId = res.locals?.user?.userId;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      if (!commentId) throw new InvalidDataException(Errors.INVALID_CREDENTIALS);

      const data = await this._getRepliesUseCase.execute(commentId, limit, page, currentUserId);

      ResponseHelper.success(res, MESSAGES.REPLY.REPLY_FETCHED_SUCCESSFULLY, data, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  async likeReply(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { replyId } = req.params;
      const likerId = res.locals?.user?.userId;
      const likerRole = res.locals?.user?.role;

      if (!replyId) throw new InvalidDataException(Errors.INVALID_DATA);

      const result = await this._likeReplyUseCase.execute(replyId, likerId, likerRole);

      ResponseHelper.success(res, MESSAGES.REPLY.REPLY_LIKED_SUCCESSFULLY, result, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }
}

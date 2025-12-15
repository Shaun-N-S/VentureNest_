import { NextFunction, Request, Response } from "express";
import { ICreateCommentUseCase } from "@domain/interfaces/useCases/comment/ICreateCommentUseCase";
import { InvalidDataException, NotFoundExecption } from "application/constants/exceptions";
import { COMMENT_ERRORS, Errors } from "@shared/constants/error";
import { ResponseHelper } from "@shared/utils/responseHelper";
import { MESSAGES } from "@shared/constants/messages";
import { HTTPSTATUS } from "@shared/constants/httpStatus";
import { IGetCommentsUseCase } from "@domain/interfaces/useCases/comment/IGetCommentUseCase";
import { ILikeCommentUseCase } from "@domain/interfaces/useCases/comment/ILikeCommentUseCase";

export class CommentController {
  constructor(
    private _createCommentUseCase: ICreateCommentUseCase,
    private _getCommentsUseCase: IGetCommentsUseCase,
    private _likeCommentUseCase: ILikeCommentUseCase
  ) {}

  async addComment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = res.locals?.user?.userId;
      const userRole = res.locals?.user?.role;
      const postId = req.params.postId!;
      const { commentText } = req.body;
      console.log("data in local", res.locals.users, "cookies", req.cookies);
      console.log(userId, userRole, postId, commentText);

      if (!commentText) throw new NotFoundExecption(COMMENT_ERRORS.NO_COMMENT_FOUND);

      const data = await this._createCommentUseCase.addComment({
        postId,
        userId,
        userRole,
        commentText,
      });

      ResponseHelper.success(res, MESSAGES.COMMENT.COMMENT_ADD_SUCCESSFULLY, data, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  async getComments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const postId = req.params.postId;
      const userId = res.locals?.user?.userId;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      console.log(postId, page, limit);
      if (!postId) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      const data = await this._getCommentsUseCase.execute(postId, limit, page, userId);
      console.log(data);

      ResponseHelper.success(
        res,
        MESSAGES.COMMENT.COMMENT_FETCHED_SUCCESSFULLY,
        data,
        HTTPSTATUS.OK
      );
    } catch (error) {
      next(error);
    }
  }

  async likeComment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { commentId } = req.params;
      const likerId = res.locals.user.userId;
      const likerRole = res.locals.user.role;

      if (!commentId) throw new InvalidDataException(Errors.INVALID_DATA);

      const result = await this._likeCommentUseCase.execute(commentId, likerId, likerRole);

      ResponseHelper.success(
        res,
        MESSAGES.COMMENT.COMMENT_LIKED_SUCCESSFULLY,
        result,
        HTTPSTATUS.OK
      );
    } catch (error) {
      next(error);
    }
  }
}

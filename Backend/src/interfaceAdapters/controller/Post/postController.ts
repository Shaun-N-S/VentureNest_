import { ICreatePostUseCase } from "@domain/interfaces/useCases/post/ICreatePostUseCase";
import { IFetchAllPostsUseCase } from "@domain/interfaces/useCases/post/IFetchAllPosts";
import { IFetchPersonalPostUseCase } from "@domain/interfaces/useCases/post/IFetchPersonalPostUseCase";
import { IRemovePostUseCase } from "@domain/interfaces/useCases/post/IRemovePostUseCase";
import { MulterFiles } from "@domain/types/multerFilesType";
import { Errors } from "@shared/constants/error";
import { HTTPSTATUS } from "@shared/constants/httpStatus";
import { MESSAGES } from "@shared/constants/messages";
import { multerFileToFileConverter } from "@shared/utils/fileConverter";
import { ResponseHelper } from "@shared/utils/responseHelper";
import { createPostSchema } from "@shared/validations/postValidator";
import { InvalidDataException } from "application/constants/exceptions";
import { CreatePostDTO } from "application/dto/post/postDTO";
import { NextFunction, Request, Response } from "express";

export class PostController {
  constructor(
    private _createPostUseCase: ICreatePostUseCase,
    private _fetchPersonalPost: IFetchPersonalPostUseCase,
    private _fetchAllPosts: IFetchAllPostsUseCase,
    private _removePosts: IRemovePostUseCase
  ) {}

  async addPost(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const formData = req.body;
      const files = (req.files as MulterFiles<"mediaUrls">)?.mediaUrls;

      const data: CreatePostDTO = { ...formData };
      console.log(data);

      if (files && Array.isArray(files) && files.length > 0) {
        data.mediaUrls = files.map((file) => multerFileToFileConverter(file));
      }

      const validatedData = createPostSchema.safeParse(data);

      if (!validatedData.success) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      await this._createPostUseCase.createPost(validatedData.data);

      ResponseHelper.success(res, MESSAGES.POST.POST_ADD_SUCCESSFULLY, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  async fetchPersonalPosts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authorId = res.locals?.user?.userId;
      console.log(req.cookies);
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      if (!authorId) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      const data = await this._fetchPersonalPost.fetchPersonalPost(authorId!, page, limit);
      console.log(data);

      ResponseHelper.success(res, MESSAGES.POST.POST_FETCHED_SUCCESSFULLY, { data }, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  async fetchAllPosts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const data = await this._fetchAllPosts.fetchAllPosts(page, limit);
      console.log(data);

      ResponseHelper.success(res, MESSAGES.POST.POST_FETCHED_SUCCESSFULLY, { data }, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  async removePost(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const postId = req.params.id!;
      const authorId = res.locals?.user?.userId;
      console.log("reached backend ........           :", postId, authorId);
      await this._removePosts.removePost(postId, authorId);

      ResponseHelper.success(res, MESSAGES.POST.POST_REMOVED_SUCCESSFULLY, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }
}

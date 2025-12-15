import { ICreatePostUseCase } from "@domain/interfaces/useCases/post/ICreatePostUseCase";
import { IFetchAllPostsUseCase } from "@domain/interfaces/useCases/post/IFetchAllPosts";
import { IFetchPersonalPostUseCase } from "@domain/interfaces/useCases/post/IFetchPersonalPostUseCase";
import { ILikePostUseCase } from "@domain/interfaces/useCases/post/ILikePostUseCase";
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
    private _removePosts: IRemovePostUseCase,
    private _likePost: ILikePostUseCase
  ) {}

  async addPost(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const formData = req.body;
      const files = (req.files as MulterFiles<"mediaUrls">)?.mediaUrls;
      console.log("RAW MULTER FILES:", files);

      const data: any = { ...formData };
      console.log(data);

      if (files && Array.isArray(files) && files.length > 0) {
        data.mediaUrls = files.map((file) => multerFileToFileConverter(file));
      }

      const validatedData = createPostSchema.safeParse(data);

      if (!validatedData.success) {
        console.log(validatedData.error);
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      const cleanData = validatedData.data as CreatePostDTO;
      const createdPost = await this._createPostUseCase.createPost(cleanData);

      ResponseHelper.success(res, MESSAGES.POST.POST_ADD_SUCCESSFULLY, createdPost, HTTPSTATUS.OK);
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
      const currentUserId = res.locals?.user?.userId;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const data = await this._fetchAllPosts.fetchAllPosts(currentUserId, page, limit);
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

  async likePost(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { postId } = req.params;
      const likerId = res.locals?.user?.userId;
      const likerRole = res.locals?.user?.role;

      if (!postId) throw new InvalidDataException(Errors.INVALID_DATA);

      const result = await this._likePost.execute(postId, likerId, likerRole);

      ResponseHelper.success(res, MESSAGES.POST.POST_LIKED_SUCCESSFULY, result, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }
}

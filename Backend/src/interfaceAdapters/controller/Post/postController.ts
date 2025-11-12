import { ICreatePostUseCase } from "@domain/interfaces/useCases/post/ICreatePostUseCase";
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
  constructor(private _createPostUseCase: ICreatePostUseCase) {}

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
}

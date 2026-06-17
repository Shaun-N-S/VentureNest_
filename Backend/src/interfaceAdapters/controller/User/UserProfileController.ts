import { IFetchUserProfileUseCase } from "@domain/interfaces/useCases/user/profile/IFetchUserProfileUseCase";
import { IUpdateUserProfileUseCase } from "@domain/interfaces/useCases/user/profile/IUpdateUserProfileUseCase";
import { MulterFiles } from "@domain/types/multerFilesType";
import { Errors } from "@shared/constants/error";
import { HTTPSTATUS } from "@shared/constants/httpStatus";
import { MESSAGES } from "@shared/constants/messages";
import { multerFileToFileConverter } from "@shared/utils/fileConverter";
import { ResponseHelper } from "@shared/utils/responseHelper";
import { userProfileUpdateSchema } from "@shared/validations/userProfileUpdateValidator";
import {
  DataMissingExecption,
  ForbiddenException,
  InvalidDataException,
} from "application/constants/exceptions";
import {
  UserProfileUpdateModelDTO,
  UserProfileUpdateReqDTO,
} from "application/dto/user/userProfileUpdateDTO";
import { NextFunction, Request, Response } from "express";

export class UserProfileController {
  constructor(
    private _udpateUserProfileUseCase: IUpdateUserProfileUseCase,
    private _fetchUserProfileUseCase: IFetchUserProfileUseCase
  ) {}

  async getProfileData(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        throw new DataMissingExecption(Errors.INVALID_DATA);
      }

      const profileData = await this._fetchUserProfileUseCase.fetchUserProfile(id);
      console.log(profileData);
      ResponseHelper.success(
        res,
        MESSAGES.USERS.PROFILE_DATA_SUCCESS,
        { profileData },
        HTTPSTATUS.OK
      );
    } catch (error) {
      next(error);
    }
  }

  async updateProfileData(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = res.locals?.user?.userId;
      let formData: UserProfileUpdateModelDTO | undefined;

      try {
        formData = req.body?.formData ? JSON.parse(req.body.formData) : undefined;
      } catch {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      const files = req.files as MulterFiles<"profileImg">;

      if (!userId) {
        throw new ForbiddenException(Errors.UNAUTHORIZED_ACCESS);
      }
      const data: UserProfileUpdateReqDTO = {
        id: userId,
      };

      if (formData) {
        data.formData = formData;
      }

      if (files["profileImg"]?.[0]) {
        data.profileImg = multerFileToFileConverter(files["profileImg"][0]);
      }

      const validatedData = userProfileUpdateSchema.safeParse(data);

      if (validatedData.error) {
        throw new InvalidDataException(
          validatedData.error.issues[0]?.message || Errors.INVALID_DATA
        );
      }

      const response = await this._udpateUserProfileUseCase.updateUserProfile(
        validatedData.data as UserProfileUpdateReqDTO
      );

      ResponseHelper.success(res, MESSAGES.USERS.PROFILE_UPDATED_SUCCESS, response, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }
}

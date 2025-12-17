import { IFetchUserProfileUseCase } from "@domain/interfaces/useCases/user/profile/IFetchUserProfileUseCase";
import { IUpdateUserProfileUseCase } from "@domain/interfaces/useCases/user/profile/IUpdateUserProfileUseCase";
import { MulterFiles } from "@domain/types/multerFilesType";
import { Errors } from "@shared/constants/error";
import { HTTPSTATUS } from "@shared/constants/httpStatus";
import { MESSAGES } from "@shared/constants/messages";
import { multerFileToFileConverter } from "@shared/utils/fileConverter";
import { ResponseHelper } from "@shared/utils/responseHelper";
import { userProfileUpdateSchema } from "@shared/validations/userProfileUpdateValidator";
import { DataMissingExecption, InvalidDataException } from "application/constants/exceptions";
import { UserProfileUpdateReqDTO } from "application/dto/user/userProfileUpdateDTO";
import { NextFunction, Request, Response } from "express";

export class UserProfileController {
  constructor(
    private _udpateUserProfileUseCase: IUpdateUserProfileUseCase,
    private _fetchUserProfileUseCase: IFetchUserProfileUseCase
  ) {}

  async getProfileData(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log("reached controller");
      const { id } = req.params;
      console.log(id);
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
      console.log(error);
      next(error);
    }
  }

  async updateProfileData(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.body?.id;
      const formData = req.body?.formData ? JSON.parse(req.body.formData) : null;
      const files = req.files as MulterFiles<"profileImg">;
      console.log("user ID : : ", userId, "formdata : : : ", formData, "files img : : : ", files);

      const data: UserProfileUpdateReqDTO = { id: userId, formData };

      if (files["profileImg"]?.[0]) {
        data.profileImg = multerFileToFileConverter(files["profileImg"][0]);
      }

      const validatedData = userProfileUpdateSchema.parse(data) as UserProfileUpdateReqDTO;

      if (!validatedData) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      const response = await this._udpateUserProfileUseCase.updateUserProfile(validatedData!);

      ResponseHelper.success(res, MESSAGES.USERS.PROFILE_UPDATED_SUCCESS, response, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }
}

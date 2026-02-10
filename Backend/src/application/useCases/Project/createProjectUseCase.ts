import { ProjectEntity } from "@domain/entities/project/projectEntity";
import { StorageFolderNames } from "@domain/enum/storageFolderNames";
import { WalletOwnerType } from "@domain/enum/walletOwnerType";
import { KYCStatus } from "@domain/enum/kycStatus";
import { IUserRepository } from "@domain/interfaces/repositories/IUserRepository";
import { IProjectRepository } from "@domain/interfaces/repositories/IProjectRepository";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";
import { ICreateProjectUseCase } from "@domain/interfaces/useCases/project/ICreateProjectUseCase";
import { ICreateWalletUseCase } from "@domain/interfaces/useCases/wallet/ICreateWalletUseCase";
import { CreateProjectDTO } from "application/dto/project/projectDTO";
import { ProjectMapper } from "application/mappers/projectMapper";
import { ForbiddenException } from "application/constants/exceptions";
import { Errors, USER_ERRORS } from "@shared/constants/error";

export class CreateProjectUseCase implements ICreateProjectUseCase {
  constructor(
    private _projectRepository: IProjectRepository,
    private _storageService: IStorageService,
    private _createWalletUseCase: ICreateWalletUseCase,
    private _userRepository: IUserRepository
  ) {}

  async createProject(data: CreateProjectDTO): Promise<{ projectId: string; logoUrl?: string }> {
    const { userId } = data;

    //KYC CHECK
    const user = await this._userRepository.findById(userId);

    if (!user) {
      throw new ForbiddenException(USER_ERRORS.USER_NOT_FOUND);
    }

    if (user.kycStatus !== KYCStatus.APPROVED) {
      throw new ForbiddenException(Errors.KYC_NOT_VERIFIED);
    }

    // Upload files
    const uploadedPitchDeckUrl = data.pitchDeckUrl
      ? await this._storageService.upload(
          data.pitchDeckUrl,
          `${StorageFolderNames.PROJECT_PITCH_DECK}/${userId}-${Date.now()}`
        )
      : "";

    const uploadedLogoUrl = data.logoUrl
      ? await this._storageService.upload(
          data.logoUrl,
          `${StorageFolderNames.PROJECT_LOGO}/${userId}-${Date.now()}`
        )
      : "";

    const uploadedCoverImageUrl = data.coverImageUrl
      ? await this._storageService.upload(
          data.coverImageUrl,
          `${StorageFolderNames.PROJECT_COVER_IMAGE}/${userId}-${Date.now()}`
        )
      : "";

    // Create project entity
    const projectEntity: ProjectEntity = ProjectMapper.createToEntity({
      ...data,
      pitchDeckUrl: uploadedPitchDeckUrl,
      logoUrl: uploadedLogoUrl,
      coverImageUrl: uploadedCoverImageUrl,
    });

    const savedProject = await this._projectRepository.save(projectEntity);

    // Create project wallet ONLY after project creation
    await this._createWalletUseCase.execute(WalletOwnerType.PROJECT, savedProject._id!);

    const signedLogoUrl = uploadedLogoUrl
      ? await this._storageService.createSignedUrl(uploadedLogoUrl, 600)
      : undefined;

    return {
      projectId: savedProject._id!,
      logoUrl: signedLogoUrl ?? "",
    };
  }
}

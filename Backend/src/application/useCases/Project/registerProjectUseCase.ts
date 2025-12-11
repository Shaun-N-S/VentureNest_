import { IRegisterProjectUseCase } from "@domain/interfaces/useCases/project/IRegisterProjectUseCase";
import { IProjectRegistrationRepository } from "@domain/interfaces/repositories/IProjectRegistrationRepository";
import { CreateProjectRegistrationDTO } from "application/dto/project/projectRegistrationDTO";
import { ProjectRegistrationMapper } from "application/mappers/projectRegistrationMapper";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";
import { StorageFolderNames } from "@domain/enum/storageFolderNames";

export class RegisterProjectUseCase implements IRegisterProjectUseCase {
  constructor(
    private _registrationRepository: IProjectRegistrationRepository,
    private _storageService: IStorageService
  ) {}

  async registerProject(data: CreateProjectRegistrationDTO): Promise<void> {
    const { founderId } = data;

    const uploadedGstCertificateUrl = data.gstCertificate
      ? await this._storageService.upload(
          data.gstCertificate,
          `${StorageFolderNames.PROJECT_REGISTRATION_GST}/${founderId}-${Date.now()}`
        )
      : "";

    const uploadedCompanyRegUrl = data.companyRegistrationCertificate
      ? await this._storageService.upload(
          data.companyRegistrationCertificate,
          `${StorageFolderNames.PROJECT_REGISTRATION_COMPANY_CERT}/${founderId}-${Date.now()}`
        )
      : "";

    const registrationEntity = ProjectRegistrationMapper.toEntity({
      ...data,
      gstCertificateUrl: uploadedGstCertificateUrl,
      companyRegistrationCertificateUrl: uploadedCompanyRegUrl,
    });

    await this._registrationRepository.save(registrationEntity);
  }
}

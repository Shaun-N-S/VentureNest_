import { IProjectRegistrationRepository } from "@domain/interfaces/repositories/IProjectRegistrationRepository";
import { IGetAllProjectRegistrationsUseCase } from "@domain/interfaces/useCases/admin/project/IGetAllProjectRegistrationsUseCase";
import { ProjectRegistrationStatus } from "@domain/enum/projectRegistrationStatus";
import { ProjectRegistrationMapper } from "application/mappers/projectRegistrationMapper";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";
import { CONFIG } from "@config/config";

export class GetAllProjectRegistrationsUseCase implements IGetAllProjectRegistrationsUseCase {
  constructor(
    private _projectRegistrationRepo: IProjectRegistrationRepository,
    private _storageService: IStorageService
  ) {}

  async execute(page: number, limit: number, status?: ProjectRegistrationStatus) {
    const skip = (page - 1) * limit;

    const [docs, total] = await Promise.all([
      this._projectRegistrationRepo.findAllAdmin(skip, limit, status),
      this._projectRegistrationRepo.countAdmin(status),
    ]);

    const registrations = await Promise.all(
      docs.map(async (doc) => {
        const dto = ProjectRegistrationMapper.toAdminDTO(doc);

        // Founder Profile Image
        if (dto.founder?.profileImg) {
          dto.founder.profileImg = await this._storageService.createSignedUrl(
            dto.founder.profileImg,
            CONFIG.SIGNED_URL_EXPIRY
          );
        }

        // Project Logo
        if (dto.project?.logoUrl) {
          dto.project.logoUrl = await this._storageService.createSignedUrl(
            dto.project.logoUrl,
            CONFIG.SIGNED_URL_EXPIRY
          );
        }

        // Project Cover Image
        if (dto.project?.coverImageUrl) {
          dto.project.coverImageUrl = await this._storageService.createSignedUrl(
            dto.project.coverImageUrl,
            CONFIG.SIGNED_URL_EXPIRY
          );
        }

        // GST Certificate
        if (dto.gstCertificateUrl) {
          dto.gstCertificateUrl = await this._storageService.createSignedUrl(
            dto.gstCertificateUrl,
            CONFIG.SIGNED_URL_EXPIRY
          );
        }

        // Company Registration Certificate
        if (dto.companyRegistrationCertificateUrl) {
          dto.companyRegistrationCertificateUrl = await this._storageService.createSignedUrl(
            dto.companyRegistrationCertificateUrl,
            CONFIG.SIGNED_URL_EXPIRY
          );
        }

        return dto;
      })
    );

    return {
      registrations,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  }
}

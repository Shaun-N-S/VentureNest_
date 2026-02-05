import { IPitchRepository } from "@domain/interfaces/repositories/IPitchRepository";
import { IGetPitchDetailsUseCase } from "@domain/interfaces/useCases/pitch/IGetPitchDetailsUseCase";
import { PitchMapper } from "application/mappers/pitchMapper";
import { PitchStatus } from "@domain/enum/pitchStatus";
import { ForbiddenException, NotFoundExecption } from "application/constants/exceptions";
import { Errors, PITCH_ERRORS } from "@shared/constants/error";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";

export class GetPitchDetailsUseCase implements IGetPitchDetailsUseCase {
  constructor(
    private _pitchRepo: IPitchRepository,
    private _storageService: IStorageService
  ) {}

  async execute(pitchId: string, viewerId: string) {
    const pitch = await this._pitchRepo.findDetailsById(pitchId);

    if (!pitch) {
      throw new NotFoundExecption(PITCH_ERRORS.NOT_FOUND);
    }

    const isInvestor = pitch.investorId._id === viewerId;
    const isFounder = pitch.founderId._id === viewerId;

    if (!isInvestor && !isFounder) {
      throw new ForbiddenException(Errors.NOT_ALLOWED);
    }

    if (isInvestor && pitch.status === PitchStatus.SENT) {
      await this._pitchRepo.updateStatus(pitchId, PitchStatus.VIEWED);
      pitch.status = PitchStatus.VIEWED;
    }

    const dto = PitchMapper.toPitchDetailsDTO(pitch);

    if (dto.project.logoUrl) {
      dto.project.logoUrl = await this._storageService.createSignedUrl(
        dto.project.logoUrl,
        10 * 60
      );
    }

    if (dto.founder.profileImg) {
      dto.founder.profileImg = await this._storageService.createSignedUrl(
        dto.founder.profileImg,
        10 * 60
      );
    }

    if (dto.investor.profileImg) {
      dto.investor.profileImg = await this._storageService.createSignedUrl(
        dto.investor.profileImg,
        10 * 60
      );
    }

    return dto;
  }
}

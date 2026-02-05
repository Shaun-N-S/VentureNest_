import { IPitchRepository } from "@domain/interfaces/repositories/IPitchRepository";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";
import { IGetReceivedPitchesUseCase } from "@domain/interfaces/useCases/pitch/IGetReceivedPitchesUseCase";
import { PitchMapper } from "application/mappers/pitchMapper";

export class GetReceivedPitchesUseCase implements IGetReceivedPitchesUseCase {
  constructor(
    private _pitchRepo: IPitchRepository,
    private _storageService: IStorageService
  ) {}

  async execute(investorId: string) {
    const pitches = await this._pitchRepo.findReceivedByInvestor(investorId);
    const dtoList = PitchMapper.toReceivedPitchListFromPopulated(pitches);

    return Promise.all(
      dtoList.map(async (pitch) => {
        if (pitch.projectLogoUrl) {
          pitch.projectLogoUrl = await this._storageService.createSignedUrl(
            pitch.projectLogoUrl,
            10 * 60
          );
        }

        if (pitch.founderProfileImg) {
          pitch.founderProfileImg = await this._storageService.createSignedUrl(
            pitch.founderProfileImg,
            10 * 60
          );
        }

        return pitch;
      })
    );
  }
}

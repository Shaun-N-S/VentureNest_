import { IPitchRepository } from "@domain/interfaces/repositories/IPitchRepository";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";
import { IGetSentPitchesUseCase } from "@domain/interfaces/useCases/pitch/IGetSentPitchesUseCase";
import { PitchMapper } from "application/mappers/pitchMapper";

export class GetSentPitchesUseCase implements IGetSentPitchesUseCase {
  constructor(
    private _pitchRepo: IPitchRepository,
    private _storageService: IStorageService
  ) {}

  async execute(founderId: string) {
    const pitches = await this._pitchRepo.findSentByFounder(founderId);
    const dtoList = PitchMapper.toSentPitchListFromPopulated(pitches);

    return Promise.all(
      dtoList.map(async (pitch) => {
        if (pitch.projectLogoUrl) {
          pitch.projectLogoUrl = await this._storageService.createSignedUrl(
            pitch.projectLogoUrl,
            10 * 60
          );
        }

        if (pitch.investorProfileImg) {
          pitch.investorProfileImg = await this._storageService.createSignedUrl(
            pitch.investorProfileImg,
            10 * 60
          );
        }

        return pitch;
      })
    );
  }
}

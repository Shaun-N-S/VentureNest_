import { CONFIG } from "@config/config";
import { PitchStatus } from "@domain/enum/pitchStatus";
import { IPitchRepository } from "@domain/interfaces/repositories/IPitchRepository";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";
import { IGetSentPitchesUseCase } from "@domain/interfaces/useCases/pitch/IGetSentPitchesUseCase";
import { PitchMapper } from "application/mappers/pitchMapper";

export class GetSentPitchesUseCase implements IGetSentPitchesUseCase {
  constructor(
    private readonly _pitchRepo: IPitchRepository,
    private readonly _storageService: IStorageService
  ) {}

  async execute(founderId: string, page = 1, limit = 10, status?: PitchStatus, search?: string) {
    const skip = (page - 1) * limit;

    const { items, total } = await this._pitchRepo.findSentByFounder(
      founderId,
      skip,
      limit,
      status,
      search
    );

    const dtoList = PitchMapper.toSentPitchListFromPopulated(items);

    const signedItems = await Promise.all(
      dtoList.map(async (pitch) => {
        if (pitch.projectLogoUrl) {
          pitch.projectLogoUrl = await this._storageService.createSignedUrl(
            pitch.projectLogoUrl,
            CONFIG.SIGNED_URL_EXPIRY
          );
        }

        if (pitch.investorProfileImg) {
          pitch.investorProfileImg = await this._storageService.createSignedUrl(
            pitch.investorProfileImg,
            CONFIG.SIGNED_URL_EXPIRY
          );
        }

        return pitch;
      })
    );

    return {
      data: signedItems,
      page,
      limit,
      total,
      hasNextPage: page * limit < total,
    };
  }
}

import { PitchStatus } from "@domain/enum/pitchStatus";
import { IPitchRepository } from "@domain/interfaces/repositories/IPitchRepository";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";
import { IGetReceivedPitchesUseCase } from "@domain/interfaces/useCases/pitch/IGetReceivedPitchesUseCase";
import { PitchMapper } from "application/mappers/pitchMapper";

export class GetReceivedPitchesUseCase implements IGetReceivedPitchesUseCase {
  constructor(
    private _pitchRepo: IPitchRepository,
    private _storageService: IStorageService
  ) {}

  async execute(investorId: string, page = 1, limit = 10, status?: PitchStatus, search?: string) {
    const skip = (page - 1) * limit;

    const { items, total } = await this._pitchRepo.findReceivedByInvestor(
      investorId,
      skip,
      limit,
      status,
      search
    );

    const dtoList = PitchMapper.toReceivedPitchListFromPopulated(items);

    const signedItems = await Promise.all(
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

    return {
      data: signedItems,
      page,
      limit,
      total,
      hasNextPage: page * limit < total,
    };
  }
}

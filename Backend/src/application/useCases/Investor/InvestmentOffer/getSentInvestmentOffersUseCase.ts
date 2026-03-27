import { IInvestmentOfferRepository } from "@domain/interfaces/repositories/IInvestmentOfferRepository";
import { IGetSentInvestmentOffersUseCase } from "@domain/interfaces/useCases/investor/investmentOffer/IGetSentInvestmentOffersUseCase";
import { InvestmentOfferMapper } from "application/mappers/investmentOfferMapper";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";
import { OfferStatus } from "@domain/enum/offerStatus";
import { CONFIG } from "@config/config";

export class GetSentInvestmentOffersUseCase implements IGetSentInvestmentOffersUseCase {
  constructor(
    private readonly _offerRepo: IInvestmentOfferRepository,
    private readonly _storageService: IStorageService
  ) {}

  async execute(investorId: string, page = 1, limit = 10, status?: OfferStatus, search?: string) {
    const skip = (page - 1) * limit;

    const { items, total } = await this._offerRepo.findSentByInvestor(
      investorId,
      skip,
      limit,
      status,
      search
    );

    const dtoList = InvestmentOfferMapper.toSentOfferListDTO(items);

    const signed = await Promise.all(
      dtoList.map(async (offer) => {
        if (offer.projectLogoUrl) {
          offer.projectLogoUrl = await this._storageService.createSignedUrl(
            offer.projectLogoUrl,
            CONFIG.SIGNED_URL_EXPIRY
          );
        }
        if (offer.founderProfileImg) {
          offer.founderProfileImg = await this._storageService.createSignedUrl(
            offer.founderProfileImg,
            CONFIG.SIGNED_URL_EXPIRY
          );
        }
        return offer;
      })
    );

    return {
      data: signed,
      page,
      limit,
      total,
      hasNextPage: page * limit < total,
    };
  }
}

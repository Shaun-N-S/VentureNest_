import { IInvestmentOfferRepository } from "@domain/interfaces/repositories/IInvestmentOfferRepository";
import { IGetSentInvestmentOffersUseCase } from "@domain/interfaces/useCases/investor/investmentOffer/IGetSentInvestmentOffersUseCase";
import { InvestmentOfferMapper } from "application/mappers/investmentOfferMapper";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";

export class GetSentInvestmentOffersUseCase implements IGetSentInvestmentOffersUseCase {
  constructor(
    private _offerRepo: IInvestmentOfferRepository,
    private _storageService: IStorageService
  ) {}

  async execute(investorId: string) {
    const offers = await this._offerRepo.findSentByInvestor(investorId);

    const dtoList = InvestmentOfferMapper.toSentOfferListDTO(offers);

    return Promise.all(
      dtoList.map(async (offer) => {
        if (offer.projectLogoUrl) {
          offer.projectLogoUrl = await this._storageService.createSignedUrl(
            offer.projectLogoUrl,
            10 * 60
          );
        }

        if (offer.founderProfileImg) {
          offer.founderProfileImg = await this._storageService.createSignedUrl(
            offer.founderProfileImg,
            10 * 60
          );
        }

        return offer;
      })
    );
  }
}

import { IInvestmentOfferRepository } from "@domain/interfaces/repositories/IInvestmentOfferRepository";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";
import { InvestmentOfferMapper } from "application/mappers/investmentOfferMapper";
import { IGetReceivedInvestmentOffersUseCase } from "@domain/interfaces/useCases/investor/investmentOffer/IGetReceivedInvestmentOffersUseCase";

export class GetReceivedInvestmentOffersUseCase implements IGetReceivedInvestmentOffersUseCase {
  constructor(
    private _offerRepo: IInvestmentOfferRepository,
    private _storageService: IStorageService
  ) {}

  async execute(founderId: string) {
    const offers = await this._offerRepo.findReceivedByFounder(founderId);

    const mapped = InvestmentOfferMapper.toReceivedOfferListDTO(offers);

    return Promise.all(
      mapped.map(async (o) => {
        if (o.projectLogoUrl) {
          o.projectLogoUrl = await this._storageService.createSignedUrl(o.projectLogoUrl, 10 * 60);
        }

        if (o.investorProfileImg) {
          o.investorProfileImg = await this._storageService.createSignedUrl(
            o.investorProfileImg,
            10 * 60
          );
        }

        return o;
      })
    );
  }
}

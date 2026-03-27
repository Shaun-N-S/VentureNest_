import { IInvestmentOfferRepository } from "@domain/interfaces/repositories/IInvestmentOfferRepository";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";
import { InvestmentOfferMapper } from "application/mappers/investmentOfferMapper";
import { IGetReceivedInvestmentOffersUseCase } from "@domain/interfaces/useCases/investor/investmentOffer/IGetReceivedInvestmentOffersUseCase";
import { OfferStatus } from "@domain/enum/offerStatus";
import { CONFIG } from "@config/config";

export class GetReceivedInvestmentOffersUseCase implements IGetReceivedInvestmentOffersUseCase {
  constructor(
    private readonly _offerRepo: IInvestmentOfferRepository,
    private readonly _storageService: IStorageService
  ) {}

  async execute(founderId: string, page = 1, limit = 10, status?: OfferStatus, search?: string) {
    const skip = (page - 1) * limit;

    const { items, total } = await this._offerRepo.findReceivedByFounder(
      founderId,
      skip,
      limit,
      status,
      search
    );

    const dtoList = InvestmentOfferMapper.toReceivedOfferListDTO(items);

    const signed = await Promise.all(
      dtoList.map(async (offer) => {
        if (offer.projectLogoUrl) {
          offer.projectLogoUrl = await this._storageService.createSignedUrl(
            offer.projectLogoUrl,
            CONFIG.SIGNED_URL_EXPIRY
          );
        }
        if (offer.investorProfileImg) {
          offer.investorProfileImg = await this._storageService.createSignedUrl(
            offer.investorProfileImg,
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

import { IInvestmentOfferRepository } from "@domain/interfaces/repositories/IInvestmentOfferRepository";
import { IExpireInvestmentOffersUseCase } from "@domain/interfaces/useCases/investor/investmentOffer/IExpireInvestmentOffersUseCase";
import { OfferStatus } from "@domain/enum/offerStatus";

export class ExpireInvestmentOffersUseCase implements IExpireInvestmentOffersUseCase {
  constructor(private _offerRepo: IInvestmentOfferRepository) {}

  async execute(): Promise<void> {
    const now = new Date();

    const expiredOffers = await this._offerRepo.findExpiredOffers(now);

    for (const offer of expiredOffers) {
      await this._offerRepo.updateStatus(offer._id!, OfferStatus.EXPIRED);
    }
  }
}

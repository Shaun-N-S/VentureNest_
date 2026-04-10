import { investmentOfferModel } from "@infrastructure/db/models/investmentOfferModel";
import { InvestmentOfferRepository } from "@infrastructure/repostiories/investmentOfferRepository";

import { InvestmentOfferExpiryCron } from "@infrastructure/cron/investmentOfferExpiryCron";
import { ExpireInvestmentOffersUseCase } from "application/useCases/Investor/InvestmentOffer/expireInvestmentOffersUseCase";

class InvestmentOfferCronContainer {
  private _offerRepo = new InvestmentOfferRepository(investmentOfferModel);

  private _expireUC = new ExpireInvestmentOffersUseCase(this._offerRepo);

  private _cron = new InvestmentOfferExpiryCron(this._expireUC);

  start() {
    this._cron.start();
  }
}

export const investmentOfferCronContainer = new InvestmentOfferCronContainer();

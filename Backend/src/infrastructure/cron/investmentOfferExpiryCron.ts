import cron from "node-cron";
import { IExpireInvestmentOffersUseCase } from "@domain/interfaces/useCases/investor/investmentOffer/IExpireInvestmentOffersUseCase";

export class InvestmentOfferExpiryCron {
  constructor(private _expireOffersUC: IExpireInvestmentOffersUseCase) {}

  start() {
    cron.schedule("0 0 * * *", async () => {
      console.log(" Running investment offer expiry cron...");

      try {
        await this._expireOffersUC.execute();
        console.log(" Expired investment offers updated");
      } catch (error) {
        console.error(" Cron error:", error);
      }
    });
  }
}

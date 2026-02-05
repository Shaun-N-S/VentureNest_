import { investmentOfferModel } from "@infrastructure/db/models/investmentOfferModel";
import { pitchModel } from "@infrastructure/db/models/pitchModel";
import { InvestmentOfferRepository } from "@infrastructure/repostiories/investmentOfferRepository";
import { PitchRepository } from "@infrastructure/repostiories/pitchRepository";
import { CreateInvestmentOfferUseCase } from "application/useCases/Investor/InvestmentOffer/createInvestmentOfferUseCase";
import { InvestmentOfferController } from "interfaceAdapters/controller/Investor/InvestmentOfferController";

const investmentOfferRepo = new InvestmentOfferRepository(investmentOfferModel);
const pitchRepo = new PitchRepository(pitchModel);

const createInvestmentOfferUseCase = new CreateInvestmentOfferUseCase(
  investmentOfferRepo,
  pitchRepo
);

export const investmentOfferController = new InvestmentOfferController(
  createInvestmentOfferUseCase
);

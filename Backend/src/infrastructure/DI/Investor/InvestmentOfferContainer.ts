import { investmentOfferModel } from "@infrastructure/db/models/investmentOfferModel";
import { pitchModel } from "@infrastructure/db/models/pitchModel";
import { InvestmentOfferRepository } from "@infrastructure/repostiories/investmentOfferRepository";
import { PitchRepository } from "@infrastructure/repostiories/pitchRepository";
import { StorageService } from "@infrastructure/services/storageService";
import { AcceptInvestmentOfferUseCase } from "application/useCases/Investor/InvestmentOffer/acceptInvestmentOfferUseCase";
import { CreateInvestmentOfferUseCase } from "application/useCases/Investor/InvestmentOffer/createInvestmentOfferUseCase";
import { GetInvestmentOfferDetailsUseCase } from "application/useCases/Investor/InvestmentOffer/getInvestmentOfferDetailsUseCase";
import { GetReceivedInvestmentOffersUseCase } from "application/useCases/Investor/InvestmentOffer/getReceivedInvestmentOffersUseCase";
import { GetSentInvestmentOffersUseCase } from "application/useCases/Investor/InvestmentOffer/getSentInvestmentOffersUseCase";
import { InvestmentOfferController } from "interfaceAdapters/controller/Investor/InvestmentOfferController";

const investmentOfferRepo = new InvestmentOfferRepository(investmentOfferModel);
const pitchRepo = new PitchRepository(pitchModel);
const storageService = new StorageService();

const createInvestmentOfferUseCase = new CreateInvestmentOfferUseCase(
  investmentOfferRepo,
  pitchRepo
);
const getSentInvestmentOfferUseCase = new GetSentInvestmentOffersUseCase(
  investmentOfferRepo,
  storageService
);
const getReceivedOfferUseCase = new GetReceivedInvestmentOffersUseCase(
  investmentOfferRepo,
  storageService
);
const getOfferDetailsUseCase = new GetInvestmentOfferDetailsUseCase(
  investmentOfferRepo,
  storageService
);
const acceptInvestmentOfferUseCase = new AcceptInvestmentOfferUseCase(investmentOfferRepo);

export const investmentOfferController = new InvestmentOfferController(
  createInvestmentOfferUseCase,
  getSentInvestmentOfferUseCase,
  getReceivedOfferUseCase,
  getOfferDetailsUseCase,
  acceptInvestmentOfferUseCase
);

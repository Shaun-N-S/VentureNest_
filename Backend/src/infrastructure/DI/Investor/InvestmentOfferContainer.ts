import { MongooseUnitOfWork } from "@infrastructure/db/connectDB/MongooseUnitOfWork";
import { dealInstallmentModel } from "@infrastructure/db/models/dealInstallmentModel";
import { dealModel } from "@infrastructure/db/models/dealModel";
import { investmentOfferModel } from "@infrastructure/db/models/investmentOfferModel";
import { notificationModel } from "@infrastructure/db/models/notificationModel";
import { pitchModel } from "@infrastructure/db/models/pitchModel";
import { DealInstallmentRepository } from "@infrastructure/repostiories/dealInstallmentRepository";
import { DealRepository } from "@infrastructure/repostiories/dealRepository";
import { InvestmentOfferRepository } from "@infrastructure/repostiories/investmentOfferRepository";
import { NotificationRepository } from "@infrastructure/repostiories/notificationRepository";
import { PitchRepository } from "@infrastructure/repostiories/pitchRepository";
import { StorageService } from "@infrastructure/services/storageService";
import { AcceptInvestmentOfferUseCase } from "application/useCases/Investor/InvestmentOffer/acceptInvestmentOfferUseCase";
import { CreateInvestmentOfferUseCase } from "application/useCases/Investor/InvestmentOffer/createInvestmentOfferUseCase";
import { GetInvestmentOfferDetailsUseCase } from "application/useCases/Investor/InvestmentOffer/getInvestmentOfferDetailsUseCase";
import { GetReceivedInvestmentOffersUseCase } from "application/useCases/Investor/InvestmentOffer/getReceivedInvestmentOffersUseCase";
import { GetSentInvestmentOffersUseCase } from "application/useCases/Investor/InvestmentOffer/getSentInvestmentOffersUseCase";
import { RejectInvestmentOfferUseCase } from "application/useCases/Investor/InvestmentOffer/rejectInvestmentOfferUseCase";
import { CreateNotificationUseCase } from "application/useCases/Notification/createNotificationUseCase";
import { InvestmentOfferController } from "interfaceAdapters/controller/Investor/InvestmentOfferController";

const investmentOfferRepo = new InvestmentOfferRepository(investmentOfferModel);
const pitchRepo = new PitchRepository(pitchModel);
const dealRepo = new DealRepository(dealModel);
const storageService = new StorageService();
const notificationRepo = new NotificationRepository(notificationModel);
const dealInstallmentRepo = new DealInstallmentRepository(dealInstallmentModel);
const unitOfWork = new MongooseUnitOfWork();

const createNotificationUseCase = new CreateNotificationUseCase(notificationRepo);
const createInvestmentOfferUseCase = new CreateInvestmentOfferUseCase(
  investmentOfferRepo,
  pitchRepo,
  createNotificationUseCase
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
  storageService,
  dealRepo,
  dealInstallmentRepo
);
const acceptInvestmentOfferUseCase = new AcceptInvestmentOfferUseCase(
  investmentOfferRepo,
  dealRepo,
  createNotificationUseCase,
  unitOfWork
);
const rejectInvestmentOfferUseCase = new RejectInvestmentOfferUseCase(
  investmentOfferRepo,
  createNotificationUseCase
);

export const investmentOfferController = new InvestmentOfferController(
  createInvestmentOfferUseCase,
  getSentInvestmentOfferUseCase,
  getReceivedOfferUseCase,
  getOfferDetailsUseCase,
  acceptInvestmentOfferUseCase,
  rejectInvestmentOfferUseCase
);

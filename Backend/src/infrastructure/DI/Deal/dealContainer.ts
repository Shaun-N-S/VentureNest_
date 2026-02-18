import { dealInstallmentModel } from "@infrastructure/db/models/dealInstallmentModel";
import { dealModel } from "@infrastructure/db/models/dealModel";
import { DealInstallmentRepository } from "@infrastructure/repostiories/dealInstallmentRepository";
import { DealRepository } from "@infrastructure/repostiories/dealRepository";
import { StripePaymentService } from "@infrastructure/services/Stripe/stripePaymentService";
import { CreateDealInstallmentCheckoutUseCase } from "application/useCases/Deal/createDealInstallmentCheckoutUseCase";
import { GetDealDetailsUseCase } from "application/useCases/Deal/getDealDetailsUseCase";
import { GetDealInstallmentsUseCase } from "application/useCases/Deal/getDealInstallmentsUseCase";
import { GetMyDealsUseCase } from "application/useCases/Deal/getMyDealsUseCase";
import { DealController } from "interfaceAdapters/controller/Deal/dealController";

const dealRepo = new DealRepository(dealModel);
const dealInstallmentRepo = new DealInstallmentRepository(dealInstallmentModel);
const paymentService = new StripePaymentService();

const createDealInstallmentCheckoutUseCase = new CreateDealInstallmentCheckoutUseCase(
  dealRepo,
  paymentService
);
const getMyDealsUseCase = new GetMyDealsUseCase(dealRepo);
const getDealDetailsUseCase = new GetDealDetailsUseCase(dealRepo, dealInstallmentRepo);
const getDealInstallmentUseCase = new GetDealInstallmentsUseCase(dealRepo, dealInstallmentRepo);

export const dealController = new DealController(
  createDealInstallmentCheckoutUseCase,
  getMyDealsUseCase,
  getDealDetailsUseCase,
  getDealInstallmentUseCase
);

import { dealModel } from "@infrastructure/db/models/dealModel";
import { DealRepository } from "@infrastructure/repostiories/dealRepository";
import { StripePaymentService } from "@infrastructure/services/Stripe/stripePaymentService";
import { CreateDealInstallmentCheckoutUseCase } from "application/useCases/Deal/createDealInstallmentCheckoutUseCase";
import { DealController } from "interfaceAdapters/controller/Deal/dealController";

const dealRepo = new DealRepository(dealModel);
const paymentService = new StripePaymentService();

const createDealInstallmentCheckoutUseCase = new CreateDealInstallmentCheckoutUseCase(
  dealRepo,
  paymentService
);

export const dealController = new DealController(createDealInstallmentCheckoutUseCase);

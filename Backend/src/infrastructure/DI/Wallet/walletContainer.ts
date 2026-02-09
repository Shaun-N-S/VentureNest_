import { walletModel } from "@infrastructure/db/models/walletModel";
import { WalletRepository } from "@infrastructure/repostiories/walletRepository";
import { StripePaymentService } from "@infrastructure/services/Stripe/stripePaymentService";
import { CreateWalletTopupCheckoutUseCase } from "application/useCases/Wallet/createWalletTopupCheckoutUseCase";
import { GetWalletDetailsUseCase } from "application/useCases/Wallet/getWalletDetailsUseCase";
import { WalletController } from "interfaceAdapters/controller/Wallet/walletController";

const walletRepo = new WalletRepository(walletModel);
const paymentService = new StripePaymentService();

const getWalletDetailsUseCase = new GetWalletDetailsUseCase(walletRepo);
const createWalletTopupCheckoutUseCase = new CreateWalletTopupCheckoutUseCase(paymentService);

export const walletController = new WalletController(
  getWalletDetailsUseCase,
  createWalletTopupCheckoutUseCase
);

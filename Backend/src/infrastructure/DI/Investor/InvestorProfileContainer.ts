import { investorModel } from "@infrastructure/db/models/investorModel";
import { userModel } from "@infrastructure/db/models/userModel";
import { InvestorRepository } from "@infrastructure/repostiories/investorRepository";
import { UserRepository } from "@infrastructure/repostiories/userRepository";
import { StorageService } from "@infrastructure/services/storageService";
import { KYCUpdateUseCase } from "application/useCases/auth/kycUpdateUseCase";
import { FetchInvestorProfileUseCase } from "application/useCases/Investor/Profile/fetchInvestorProfileUseCase";
import { InvestorProfileCompletionUseCase } from "application/useCases/Investor/Profile/investorProfileCompletionUseCase";
import { InvestorProfileUpdateUseCase } from "application/useCases/Investor/Profile/investorProfileUpdateUseCase";
import { InvestorProfileController } from "interfaceAdapters/controller/Investor/InvestorProfileController";

//Repositories & Service
const investorRepository = new InvestorRepository(investorModel);
const userRepository = new UserRepository(userModel);
const storageService = new StorageService();

//useCases
const investorProfileCompletionUseCase = new InvestorProfileCompletionUseCase(
  investorRepository,
  storageService
);
const fetchInvestorProfileUseCase = new FetchInvestorProfileUseCase(
  investorRepository,
  storageService
);
const investorProfileUpdateUseCase = new InvestorProfileUpdateUseCase(
  investorRepository,
  storageService
);
const kycUpdateUseCase = new KYCUpdateUseCase(investorRepository, userRepository, storageService);

//controller
export const investorProfileController = new InvestorProfileController(
  fetchInvestorProfileUseCase,
  investorProfileCompletionUseCase,
  investorProfileUpdateUseCase,
  kycUpdateUseCase
);

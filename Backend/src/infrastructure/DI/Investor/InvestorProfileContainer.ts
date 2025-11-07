import { investorModel } from "@infrastructure/db/models/investorModel";
import { InvestorRepository } from "@infrastructure/repostiories/investorRepository";
import { StorageService } from "@infrastructure/services/storageService";
import { FetchInvestorProfileUseCase } from "application/useCases/Investor/Profile/fetchInvestorProfileUseCase";
import { InvestorProfileCompletionUseCase } from "application/useCases/Investor/Profile/investorProfileCompletionUseCase";
import { InvestorProfileUpdateUseCase } from "application/useCases/Investor/Profile/investorProfileUpdateUseCase";
import { InvestorProfileController } from "interfaceAdapters/controller/Investor/InvestorProfileController";

//Repositories & Service
const investorRepository = new InvestorRepository(investorModel);
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

//controller
export const investorProfileController = new InvestorProfileController(
  fetchInvestorProfileUseCase,
  investorProfileCompletionUseCase,
  investorProfileUpdateUseCase
);

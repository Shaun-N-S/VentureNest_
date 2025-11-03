import { investorModel } from "@infrastructure/db/models/investorModel";
import { InvestorRepository } from "@infrastructure/repostiories/investorRepository";
import { StorageService } from "@infrastructure/services/storageService";
import { InvestorProfileCompletionUseCase } from "application/useCases/Investor/Profile/investorProfileCompletionUseCase";
import { InvestorProfileController } from "interfaceAdapters/controller/Investor/InvestorProfileController";

//Repositories & Service
const investorRepository = new InvestorRepository(investorModel);
const storageService = new StorageService();

//useCases
const investorProfileCompletion = new InvestorProfileCompletionUseCase(
  investorRepository,
  storageService
);

//controller
export const investorProfileController = new InvestorProfileController(investorProfileCompletion);

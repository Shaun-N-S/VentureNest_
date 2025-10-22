import { investorModel } from "@infrastructure/db/models/investorModel";
import { InvestorRepository } from "@infrastructure/repostiories/investorRepository";
import { InvestorProfileCompletionUseCase } from "application/useCases/Investor/Profile/investorProfileCompletionUseCase";
import { InvestorProfileController } from "interfaceAdapters/controller/Investor/InvestorProfileController";

//Repositories & Service
const investorRepository = new InvestorRepository(investorModel);

//useCases
const investorProfileCompletion = new InvestorProfileCompletionUseCase(investorRepository);

//controller
export const investorProfileController = new InvestorProfileController(investorProfileCompletion);

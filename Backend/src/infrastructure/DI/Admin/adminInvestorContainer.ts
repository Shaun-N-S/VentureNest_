import { KeyValueTTLCaching } from "@infrastructure/cache/redis/KeyValueTTLCaching";
import { investorModel } from "@infrastructure/db/models/investorModel";
import { InvestorRepository } from "@infrastructure/repostiories/investorRepository";
import { GetAllInvestorUseCase } from "application/useCases/Admin/investor/getAllInvestorsUseCase";
import { UpdateInvestorStatusUseCase } from "application/useCases/Admin/investor/updateInvestorStatusUseCase";
import { AdminInvestorController } from "interfaceAdapters/controller/Admin/adminInvestorController";

//Repository & Service
const investorRepository = new InvestorRepository(investorModel);
const cacheStorage = new KeyValueTTLCaching();

//UseCases
const getAllInvestorUseCase = new GetAllInvestorUseCase(investorRepository);
const updateInvestorStatusUseCase = new UpdateInvestorStatusUseCase(
  investorRepository,
  cacheStorage
);

//Controllers
export const adminInvestorController = new AdminInvestorController(
  getAllInvestorUseCase,
  updateInvestorStatusUseCase
);

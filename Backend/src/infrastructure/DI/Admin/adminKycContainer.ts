import { investorModel } from "@infrastructure/db/models/investorModel";
import { userModel } from "@infrastructure/db/models/userModel";
import { InvestorRepository } from "@infrastructure/repostiories/investorRepository";
import { UserRepository } from "@infrastructure/repostiories/userRepository";
import { GetAllInvestorKycUseCase } from "application/useCases/Admin/KYC/getAllInvestorKycInvestorUseCase";
import { GetAllUsersKycUseCases } from "application/useCases/Admin/KYC/getAllUserKycUseCase";
import { UpdateInvestorKycStatusUseCase } from "application/useCases/Admin/KYC/updateInvestorKycUseCase";
import { UpdateUserKycUseCase } from "application/useCases/Admin/KYC/updateUserKycStatusUseCase";
import { AdminKYCController } from "interfaceAdapters/controller/Admin/adminKYCController";

//Repository & Service
const investorRepository = new InvestorRepository(investorModel);
const userRepository = new UserRepository(userModel);

//UseCases
const getAllUserKycUseCase = new GetAllUsersKycUseCases(userRepository);
const getAllInvestorUseCase = new GetAllInvestorKycUseCase(investorRepository);
const updateUserKycStatusUseCase = new UpdateUserKycUseCase(userRepository);
const updateInvestorKycStatusUseCase = new UpdateInvestorKycStatusUseCase(investorRepository);

//controller
export const adminKycController = new AdminKYCController(
  getAllUserKycUseCase,
  getAllInvestorUseCase,
  updateUserKycStatusUseCase,
  updateInvestorKycStatusUseCase
);

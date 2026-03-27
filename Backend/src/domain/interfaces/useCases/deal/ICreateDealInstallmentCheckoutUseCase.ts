import { CreateDealInstallmentCheckoutDTO } from "application/dto/deal/createDealInstallmentCheckoutDTO";

export interface ICreateDealInstallmentCheckoutUseCase {
  execute(investorId: string, dto: CreateDealInstallmentCheckoutDTO): Promise<string>;
}

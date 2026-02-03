import { InvestorTicketDetailedDTO } from "application/dto/ticket/InvestorTicketDetailedDTO";

export interface IGetTicketsByInvestorUseCase {
  execute(investorId: string): Promise<InvestorTicketDetailedDTO[]>;
}

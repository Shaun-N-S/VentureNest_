import { TicketDetailedDTO } from "application/dto/ticket/TicketDetailedDTO";

export interface IGetTicketsByInvestorUseCase {
  execute(investorId: string): Promise<TicketDetailedDTO[]>;
}

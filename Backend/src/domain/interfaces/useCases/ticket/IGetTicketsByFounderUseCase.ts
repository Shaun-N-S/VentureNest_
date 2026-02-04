import { TicketDetailedDTO } from "application/dto/ticket/TicketDetailedDTO";

export interface IGetTicketsByFounderUseCase {
  execute(founderId: string): Promise<TicketDetailedDTO[]>;
}

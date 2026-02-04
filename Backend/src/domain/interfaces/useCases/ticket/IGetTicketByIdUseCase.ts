import { TicketDetailedDTO } from "application/dto/ticket/TicketDetailedDTO";

export interface IGetTicketByIdUseCase {
  execute(ticketId: string): Promise<TicketDetailedDTO>;
}

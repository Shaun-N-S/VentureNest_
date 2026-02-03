import { CreateTicketWithSessionDTO } from "application/dto/ticket/CreateTicketWithSessionDTO";

export interface ICreateTicketWithSessionUseCase {
  execute(data: CreateTicketWithSessionDTO): Promise<{ ticketId: string; sessionId: string }>;
}

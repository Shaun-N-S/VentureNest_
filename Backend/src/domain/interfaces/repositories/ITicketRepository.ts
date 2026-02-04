import { TicketEntity } from "@domain/entities/Ticket/ticketEntity";
import { IBaseRepository } from "./IBaseRepository";
import { TicketDetailedDTO } from "application/dto/ticket/TicketDetailedDTO";

export interface ITicketRepository extends IBaseRepository<TicketEntity> {
  findByInvestor(investorId: string): Promise<TicketEntity[]>;
  findByFounder(founderId: string): Promise<TicketEntity[]>;
  findByProject(projectId: string): Promise<TicketEntity[]>;
  findInvestorTicketsDetailed(investorId: string): Promise<TicketDetailedDTO[]>;
  findFounderTicketsDetailed(founderId: string): Promise<TicketDetailedDTO[]>;
  findTicketDetailedById(ticketId: string): Promise<TicketDetailedDTO | null>;
  findByInvestorAndProject(investorId: string, projectId: string): Promise<TicketEntity | null>;
}

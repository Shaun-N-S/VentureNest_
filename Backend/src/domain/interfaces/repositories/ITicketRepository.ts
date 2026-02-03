import { TicketEntity } from "@domain/entities/Ticket/ticketEntity";
import { IBaseRepository } from "./IBaseRepository";
import { InvestorTicketDetailedDTO } from "application/dto/ticket/InvestorTicketDetailedDTO";

export interface ITicketRepository extends IBaseRepository<TicketEntity> {
  findByInvestor(investorId: string): Promise<TicketEntity[]>;
  findByFounder(founderId: string): Promise<TicketEntity[]>;
  findByProject(projectId: string): Promise<TicketEntity[]>;
  findInvestorTicketsDetailed(investorId: string): Promise<InvestorTicketDetailedDTO[]>;
}

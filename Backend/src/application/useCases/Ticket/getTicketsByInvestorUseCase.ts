import { ITicketRepository } from "@domain/interfaces/repositories/ITicketRepository";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";
import { IGetTicketsByInvestorUseCase } from "@domain/interfaces/useCases/ticket/IGetTicketsByInvestorUseCase";
import { TicketDetailedDTO } from "application/dto/ticket/TicketDetailedDTO";

export class GetTicketsByInvestorUseCase implements IGetTicketsByInvestorUseCase {
  constructor(
    private readonly _ticketRepo: ITicketRepository,
    private readonly _storageService: IStorageService
  ) {}

  async execute(investorId: string): Promise<TicketDetailedDTO[]> {
    const tickets = await this._ticketRepo.findInvestorTicketsDetailed(investorId);

    return Promise.all(
      tickets.map(async (ticket) => {
        if (ticket.project.coverImageUrl) {
          ticket.project.coverImageUrl = await this._storageService.createSignedUrl(
            ticket.project.coverImageUrl,
            10 * 60
          );
        }

        if (ticket.project.logoUrl) {
          ticket.project.logoUrl = await this._storageService.createSignedUrl(
            ticket.project.logoUrl,
            10 * 60
          );
        }

        if (ticket.founder.profileImg) {
          ticket.founder.profileImg = await this._storageService.createSignedUrl(
            ticket.founder.profileImg,
            10 * 60
          );
        }

        if (ticket.investor.profileImg) {
          ticket.investor.profileImg = await this._storageService.createSignedUrl(
            ticket.investor.profileImg,
            10 * 60
          );
        }
        console.log(ticket);
        return ticket;
      })
    );
  }
}

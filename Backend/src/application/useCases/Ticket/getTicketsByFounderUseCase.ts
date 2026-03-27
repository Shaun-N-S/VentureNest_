import { CONFIG } from "@config/config";
import { ITicketRepository } from "@domain/interfaces/repositories/ITicketRepository";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";
import { IGetTicketsByFounderUseCase } from "@domain/interfaces/useCases/ticket/IGetTicketsByFounderUseCase";
import { TicketDetailedDTO } from "application/dto/ticket/TicketDetailedDTO";

export class GetTicketsByFounderUseCase implements IGetTicketsByFounderUseCase {
  constructor(
    private readonly _ticketRepo: ITicketRepository,
    private readonly _storageService: IStorageService
  ) {}

  async execute(founderId: string): Promise<TicketDetailedDTO[]> {
    const tickets = await this._ticketRepo.findFounderTicketsDetailed(founderId);
    console.log(tickets);
    return Promise.all(
      tickets.map(async (ticket) => {
        if (ticket.project.coverImageUrl) {
          ticket.project.coverImageUrl = await this._storageService.createSignedUrl(
            ticket.project.coverImageUrl,
            CONFIG.SIGNED_URL_EXPIRY
          );
        }

        if (ticket.project.logoUrl) {
          ticket.project.logoUrl = await this._storageService.createSignedUrl(
            ticket.project.logoUrl,
            CONFIG.SIGNED_URL_EXPIRY
          );
        }

        if (ticket.founder.profileImg) {
          ticket.founder.profileImg = await this._storageService.createSignedUrl(
            ticket.founder.profileImg,
            CONFIG.SIGNED_URL_EXPIRY
          );
        }

        if (ticket.investor.profileImg) {
          ticket.investor.profileImg = await this._storageService.createSignedUrl(
            ticket.investor.profileImg,
            CONFIG.SIGNED_URL_EXPIRY
          );
        }

        return ticket;
      })
    );
  }
}

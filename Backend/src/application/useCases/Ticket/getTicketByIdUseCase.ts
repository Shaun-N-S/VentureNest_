import { ITicketRepository } from "@domain/interfaces/repositories/ITicketRepository";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";
import { TicketDetailedDTO } from "application/dto/ticket/TicketDetailedDTO";
import { IGetTicketByIdUseCase } from "@domain/interfaces/useCases/ticket/IGetTicketByIdUseCase";
import { NotFoundExecption } from "application/constants/exceptions";
import { TICKET_ERRORS } from "@shared/constants/error";
import { CONFIG } from "@config/config";

export class GetTicketByIdUseCase implements IGetTicketByIdUseCase {
  constructor(
    private readonly _ticketRepo: ITicketRepository,
    private readonly _storageService: IStorageService
  ) {}

  async execute(ticketId: string): Promise<TicketDetailedDTO> {
    const ticket = await this._ticketRepo.findTicketDetailedById(ticketId);

    if (!ticket) {
      throw new NotFoundExecption(TICKET_ERRORS.TICKET_NOT_FOUND);
    }

    if (ticket.project.logoUrl) {
      ticket.project.logoUrl = await this._storageService.createSignedUrl(
        ticket.project.logoUrl,
        CONFIG.SIGNED_URL_EXPIRY
      );
    }

    if (ticket.project.coverImageUrl) {
      ticket.project.coverImageUrl = await this._storageService.createSignedUrl(
        ticket.project.coverImageUrl,
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
  }
}

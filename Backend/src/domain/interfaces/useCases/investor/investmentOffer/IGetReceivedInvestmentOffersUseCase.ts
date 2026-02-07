import { OfferStatus } from "@domain/enum/offerStatus";
import { PaginatedResponseDTO } from "application/dto/common/paginatedResponseDTO";
import { ReceivedInvestmentOfferListItemDTO } from "application/dto/investor/investmentOfferDTO/receivedInvestmentOfferListItemDTO";

export interface IGetReceivedInvestmentOffersUseCase {
  execute(
    founderId: string,
    page: number,
    limit: number,
    status?: OfferStatus,
    search?: string
  ): Promise<PaginatedResponseDTO<ReceivedInvestmentOfferListItemDTO>>;
}

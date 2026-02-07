import { OfferStatus } from "@domain/enum/offerStatus";
import { PaginatedResponseDTO } from "application/dto/common/paginatedResponseDTO";
import { SentInvestmentOfferListItemDTO } from "application/dto/investor/investmentOfferDTO/sentInvestmentOfferListItemDTO";

export interface IGetSentInvestmentOffersUseCase {
  execute(
    investorId: string,
    page: number,
    limit: number,
    status?: OfferStatus,
    search?: string
  ): Promise<PaginatedResponseDTO<SentInvestmentOfferListItemDTO>>;
}

import { OfferStatus } from "@domain/enum/offerStatus";

export interface AcceptInvestmentOfferResponseDTO {
  offerId: string;
  status: OfferStatus;
  respondedAt: Date;
}

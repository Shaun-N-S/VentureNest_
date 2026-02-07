import { IInvestmentOfferRepository } from "@domain/interfaces/repositories/IInvestmentOfferRepository";
import { IRejectInvestmentOfferUseCase } from "@domain/interfaces/useCases/investor/investmentOffer/IRejectInvestmentOfferUseCase";
import { OfferStatus } from "@domain/enum/offerStatus";
import { UserRole } from "@domain/enum/userRole";
import { ForbiddenException, NotFoundExecption } from "application/constants/exceptions";
import { Errors, OFFER_ERRORS } from "@shared/constants/error";
import { InvestmentOfferMapper } from "application/mappers/investmentOfferMapper";

export class RejectInvestmentOfferUseCase implements IRejectInvestmentOfferUseCase {
  constructor(private readonly _offerRepo: IInvestmentOfferRepository) {}

  async execute(offerId: string, founderId: string, reason: string) {
    const offer = await this._offerRepo.findById(offerId);

    if (!offer) {
      throw new NotFoundExecption(OFFER_ERRORS.NOT_FOUND);
    }

    if (offer.founderId !== founderId) {
      throw new ForbiddenException(Errors.NOT_ALLOWED);
    }

    if (offer.status !== OfferStatus.PENDING) {
      throw new ForbiddenException(OFFER_ERRORS.INVALID_STATUS);
    }

    if (!reason || reason.trim().length < 3) {
      throw new ForbiddenException(OFFER_ERRORS.REJECTION_REASON_REQUIRED);
    }

    const updated = await this._offerRepo.update(offerId, {
      status: OfferStatus.REJECTED,
      rejectionReason: reason,
      respondedAt: new Date(),
      respondedBy: UserRole.USER,
      updatedAt: new Date(),
    });

    return InvestmentOfferMapper.toAcceptResponseDTO(updated!);
  }
}

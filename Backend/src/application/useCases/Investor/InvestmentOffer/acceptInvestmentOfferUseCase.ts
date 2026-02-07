import { IInvestmentOfferRepository } from "@domain/interfaces/repositories/IInvestmentOfferRepository";
import { IAcceptInvestmentOfferUseCase } from "@domain/interfaces/useCases/investor/investmentOffer/IAcceptInvestmentOfferUseCase";
import { InvestmentOfferMapper } from "application/mappers/investmentOfferMapper";
import { OfferStatus } from "@domain/enum/offerStatus";
import { ForbiddenException, NotFoundExecption } from "application/constants/exceptions";
import { Errors, OFFER_ERRORS } from "@shared/constants/error";
import { UserRole } from "@domain/enum/userRole";

export class AcceptInvestmentOfferUseCase implements IAcceptInvestmentOfferUseCase {
  constructor(private readonly _offerRepo: IInvestmentOfferRepository) {}

  async execute(offerId: string, founderId: string) {
    const offer = await this._offerRepo.findById(offerId);

    if (!offer) {
      throw new NotFoundExecption(OFFER_ERRORS.NOT_FOUND);
    }

    if (offer.founderId !== founderId) {
      throw new ForbiddenException(Errors.NOT_ALLOWED);
    }

    if (offer.status !== OfferStatus.PENDING) {
      throw new ForbiddenException(OFFER_ERRORS.ALREADY_PROCESSED);
    }

    if (offer.expiresAt && offer.expiresAt < new Date()) {
      throw new ForbiddenException(OFFER_ERRORS.EXPIRED);
    }

    const updated = await this._offerRepo.update(offerId, {
      status: OfferStatus.ACCEPTED,
      respondedAt: new Date(),
      respondedBy: UserRole.USER,
    });

    if (!updated) {
      throw new ForbiddenException(OFFER_ERRORS.UNABLE_TO_ACCEPT);
    }

    return InvestmentOfferMapper.toAcceptResponseDTO(updated);
  }
}

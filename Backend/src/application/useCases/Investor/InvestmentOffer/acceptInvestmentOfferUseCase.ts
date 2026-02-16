import { IInvestmentOfferRepository } from "@domain/interfaces/repositories/IInvestmentOfferRepository";
import { IAcceptInvestmentOfferUseCase } from "@domain/interfaces/useCases/investor/investmentOffer/IAcceptInvestmentOfferUseCase";
import { InvestmentOfferMapper } from "application/mappers/investmentOfferMapper";
import { OfferStatus } from "@domain/enum/offerStatus";
import { ForbiddenException, NotFoundExecption } from "application/constants/exceptions";
import { Errors, OFFER_ERRORS } from "@shared/constants/error";
import { UserRole } from "@domain/enum/userRole";
import { NotificationType } from "@domain/enum/notificationType";
import { NotificationEntityType } from "@domain/enum/notificationEntityType";
import { ICreateNotificationUseCase } from "@domain/interfaces/useCases/notification/ICreateNotificationUseCase";

export class AcceptInvestmentOfferUseCase implements IAcceptInvestmentOfferUseCase {
  constructor(
    private _offerRepo: IInvestmentOfferRepository,
    private _notificationUseCase: ICreateNotificationUseCase
  ) {}

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

    await this._notificationUseCase.createNotification({
      recipientId: offer.investorId,
      recipientRole: UserRole.INVESTOR,
      actorId: founderId,
      actorRole: UserRole.USER,
      type: NotificationType.INVESTMENT_RECEIVED,
      entityId: offerId,
      entityType: NotificationEntityType.INVESTMENT_OFFER,
      message: "responded to your investment offer",
    });

    return InvestmentOfferMapper.toAcceptResponseDTO(updated);
  }
}

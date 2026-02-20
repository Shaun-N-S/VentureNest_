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
import { IDealRepository } from "@domain/interfaces/repositories/IDealRepository";
import { IUnitOfWork } from "@domain/interfaces/presistence/IUnitOfWork";
import { DealStatus } from "@domain/enum/dealStatus";

export class AcceptInvestmentOfferUseCase implements IAcceptInvestmentOfferUseCase {
  constructor(
    private _offerRepo: IInvestmentOfferRepository,
    private _dealRepo: IDealRepository,
    private _notificationUseCase: ICreateNotificationUseCase,
    private _unitOfWork: IUnitOfWork
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

    await this._unitOfWork.start();
    const session = this._unitOfWork.getSession();

    try {
      // Update Offer
      const updated = await this._offerRepo.update(
        offerId,
        {
          status: OfferStatus.ACCEPTED,
          respondedAt: new Date(),
          respondedBy: UserRole.USER,
        },
        session
      );

      if (!updated) {
        throw new ForbiddenException(OFFER_ERRORS.UNABLE_TO_ACCEPT);
      }

      // Create Deal
      await this._dealRepo.save(
        {
          projectId: offer.projectId,
          offerId: offer._id!,
          founderId: offer.founderId,
          investorId: offer.investorId,
          totalAmount: offer.amount,
          amountPaid: 0,
          remainingAmount: offer.amount,
          equityPercentage: offer.equityPercentage,
          status: DealStatus.PARTIALLY_PAID,
          createdAt: new Date(),
        },
        session
      );

      // Notification
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

      await this._unitOfWork.commit();

      return InvestmentOfferMapper.toAcceptResponseDTO(updated);
    } catch (error) {
      await this._unitOfWork.rollback();
      throw error;
    }
  }
}

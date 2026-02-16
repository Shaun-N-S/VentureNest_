import { IInvestmentOfferRepository } from "@domain/interfaces/repositories/IInvestmentOfferRepository";
import { IPitchRepository } from "@domain/interfaces/repositories/IPitchRepository";
import { InvestmentOfferMapper } from "application/mappers/investmentOfferMapper";
import { OfferStatus } from "@domain/enum/offerStatus";
import { ForbiddenException, NotFoundExecption } from "application/constants/exceptions";
import { Errors, PITCH_ERRORS } from "@shared/constants/error";
import { CreateInvestmentOfferDTO } from "application/dto/investor/investmentOfferDTO/createInvestmentOfferDTO";
import { InvestmentOfferResponseDTO } from "application/dto/investor/investmentOfferDTO/investmentOfferResponseDTO";
import { ICreateInvestmentOfferUseCase } from "@domain/interfaces/useCases/investor/investmentOffer/ICreateInvestmentOfferUseCase";
import { ICreateNotificationUseCase } from "@domain/interfaces/useCases/notification/ICreateNotificationUseCase";
import { UserRole } from "@domain/enum/userRole";
import { NotificationType } from "@domain/enum/notificationType";
import { NotificationEntityType } from "@domain/enum/notificationEntityType";
import { MESSAGES } from "@shared/constants/messages";

export class CreateInvestmentOfferUseCase implements ICreateInvestmentOfferUseCase {
  constructor(
    private _offerRepo: IInvestmentOfferRepository,
    private _pitchRepo: IPitchRepository,
    private _notificationUseCase: ICreateNotificationUseCase
  ) {}

  async execute(
    data: CreateInvestmentOfferDTO,
    investorId: string
  ): Promise<InvestmentOfferResponseDTO> {
    const pitch = await this._pitchRepo.findById(data.pitchId);

    if (!pitch) {
      throw new NotFoundExecption(PITCH_ERRORS.NOT_FOUND);
    }

    if (pitch.investorId !== investorId) {
      throw new ForbiddenException(Errors.NOT_ALLOWED);
    }

    if (pitch.projectId !== data.projectId) {
      throw new ForbiddenException(Errors.NOT_ALLOWED);
    }

    const offerEntity = InvestmentOfferMapper.toEntity({
      ...data,
      investorId,
      founderId: pitch.founderId,
      status: OfferStatus.PENDING,
    });

    const savedOffer = await this._offerRepo.save(offerEntity);

    await this._notificationUseCase.createNotification({
      recipientId: pitch.founderId,
      recipientRole: UserRole.USER,
      actorId: investorId,
      actorRole: UserRole.INVESTOR,
      type: NotificationType.INVESTMENT_RECEIVED,
      entityId: savedOffer._id!,
      entityType: NotificationEntityType.INVESTMENT_OFFER,
      message: MESSAGES.NOTIFICATION.CREATE_INVESTMENT_NOTIFICATION_SENT,
    });

    return InvestmentOfferMapper.toResponseDTO(savedOffer);
  }
}

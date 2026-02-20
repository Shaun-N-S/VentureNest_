import { IInvestmentOfferRepository } from "@domain/interfaces/repositories/IInvestmentOfferRepository";
import { IGetInvestmentOfferDetailsUseCase } from "@domain/interfaces/useCases/investor/investmentOffer/IGetInvestmentOfferDetailsUseCase";
import { InvestmentOfferMapper } from "application/mappers/investmentOfferMapper";
import { ForbiddenException, NotFoundExecption } from "application/constants/exceptions";
import { Errors, OFFER_ERRORS } from "@shared/constants/error";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";
import { IDealRepository } from "@domain/interfaces/repositories/IDealRepository";
import { OfferStatus } from "@domain/enum/offerStatus";
import { DealMapper } from "application/mappers/dealMapper";
import { IDealInstallmentRepository } from "@domain/interfaces/repositories/IDealInstallmentRepository";
import { CONFIG } from "@config/config";

export class GetInvestmentOfferDetailsUseCase implements IGetInvestmentOfferDetailsUseCase {
  constructor(
    private _offerRepo: IInvestmentOfferRepository,
    private _storageService: IStorageService,
    private _dealRepo: IDealRepository,
    private _installmentRepo: IDealInstallmentRepository
  ) {}

  async execute(offerId: string, viewerId: string) {
    const offer = await this._offerRepo.findDetailsById(offerId);

    if (!offer) {
      throw new NotFoundExecption(OFFER_ERRORS.NOT_FOUND);
    }

    const isInvestor = offer.investorId._id.toString() === viewerId;
    const isFounder = offer.founderId._id.toString() === viewerId;

    if (!isInvestor && !isFounder) {
      throw new ForbiddenException(Errors.NOT_ALLOWED);
    }

    const dto = InvestmentOfferMapper.toDetailsDTO(offer);

    if (dto.project.logoUrl) {
      dto.project.logoUrl = await this._storageService.createSignedUrl(
        dto.project.logoUrl,
        CONFIG.SIGNED_URL_EXPIRY
      );
    }

    if (dto.investor.profileImg) {
      dto.investor.profileImg = await this._storageService.createSignedUrl(
        dto.investor.profileImg,
        CONFIG.SIGNED_URL_EXPIRY
      );
    }

    if (dto.founder.profileImg) {
      dto.founder.profileImg = await this._storageService.createSignedUrl(
        dto.founder.profileImg,
        CONFIG.SIGNED_URL_EXPIRY
      );
    }

    if (offer.status === OfferStatus.ACCEPTED) {
      const deal = await this._dealRepo.findByOfferId(offerId);

      if (deal) {
        const installments = await this._installmentRepo.findByDealId(deal._id!);

        dto.deal = DealMapper.toDetailsResponseDTO(deal, installments);
      }
    }

    return dto;
  }
}

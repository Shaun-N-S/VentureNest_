import { IInvestmentOfferRepository } from "@domain/interfaces/repositories/IInvestmentOfferRepository";
import { IGetInvestmentOfferDetailsUseCase } from "@domain/interfaces/useCases/investor/investmentOffer/IGetInvestmentOfferDetailsUseCase";
import { InvestmentOfferMapper } from "application/mappers/investmentOfferMapper";
import { ForbiddenException, NotFoundExecption } from "application/constants/exceptions";
import { Errors, OFFER_ERRORS } from "@shared/constants/error";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";

export class GetInvestmentOfferDetailsUseCase implements IGetInvestmentOfferDetailsUseCase {
  constructor(
    private _offerRepo: IInvestmentOfferRepository,
    private _storageService: IStorageService
  ) {}

  async execute(offerId: string, viewerId: string) {
    const offer = await this._offerRepo.findDetailsById(offerId);

    if (!offer) {
      throw new NotFoundExecption(OFFER_ERRORS.NOT_FOUND);
    }

    const isInvestor = offer.investorId._id === viewerId;
    const isFounder = offer.founderId._id === viewerId;

    if (!isInvestor && !isFounder) {
      throw new ForbiddenException(Errors.NOT_ALLOWED);
    }

    const dto = InvestmentOfferMapper.toDetailsDTO(offer);

    if (dto.project.logoUrl) {
      dto.project.logoUrl = await this._storageService.createSignedUrl(
        dto.project.logoUrl,
        10 * 60
      );
    }

    if (dto.investor.profileImg) {
      dto.investor.profileImg = await this._storageService.createSignedUrl(
        dto.investor.profileImg,
        10 * 60
      );
    }

    if (dto.founder.profileImg) {
      dto.founder.profileImg = await this._storageService.createSignedUrl(
        dto.founder.profileImg,
        10 * 60
      );
    }

    return dto;
  }
}

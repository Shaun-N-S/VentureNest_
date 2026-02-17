import { IHandleDealInstallmentStripeCompletedUseCase } from "@domain/interfaces/useCases/deal/IHandleDealInstallmentStripeCompletedUseCase";
import { IDealRepository } from "@domain/interfaces/repositories/IDealRepository";
import { IWalletRepository } from "@domain/interfaces/repositories/IWalletRepository";
import { IDealInstallmentRepository } from "@domain/interfaces/repositories/IDealInstallmentRepository";
import { ITransactionRepository } from "@domain/interfaces/repositories/ITransactionRepository";
import { IPaymentRepository } from "@domain/interfaces/repositories/IPaymentRepository";
import { IUnitOfWork } from "@domain/interfaces/presistence/IUnitOfWork";
import { WalletOwnerType } from "@domain/enum/walletOwnerType";
import { DealStatus } from "@domain/enum/dealStatus";
import { DealInstallmentStatus } from "@domain/enum/dealInstallmentStatus";
import { TransactionAction, TransactionReason } from "@domain/enum/transactionType";
import { TransactionStatus } from "@domain/enum/transactionStatus";
import { PaymentPurpose } from "@domain/enum/paymentPurpose";
import {
  ForbiddenException,
  InvalidDataException,
  NotFoundExecption,
} from "application/constants/exceptions";
import { DEAL_ERRORS, WALLET_ERRORS } from "@shared/constants/error";
import { PLATFORM_COMMISSION_RATE } from "@shared/constants/platform";
import { HandleDealInstallmentStripeCompletedDTO } from "application/dto/deal/dealInstallmentResponseDTO";

export class HandleDealInstallmentStripeCompletedUseCase
  implements IHandleDealInstallmentStripeCompletedUseCase
{
  constructor(
    private _dealRepo: IDealRepository,
    private _walletRepo: IWalletRepository,
    private _installmentRepo: IDealInstallmentRepository,
    private _transactionRepo: ITransactionRepository,
    private _paymentRepo: IPaymentRepository,
    private _unitOfWork: IUnitOfWork
  ) {}

  async execute(dto: HandleDealInstallmentStripeCompletedDTO): Promise<void> {
    const existingPayment = await this._paymentRepo.findBySessionId(dto.sessionId);
    if (existingPayment) return;

    const deal = await this._dealRepo.findById(dto.dealId);
    if (!deal) throw new NotFoundExecption(DEAL_ERRORS.DEAL_NOT_FOUND);

    if (deal.investorId !== dto.ownerId)
      throw new ForbiddenException(DEAL_ERRORS.UNAUTHORIZED_DEAL_ACCESS);

    if (dto.amount <= 0 || dto.amount > deal.remainingAmount)
      throw new InvalidDataException(DEAL_ERRORS.INVALID_INSTALLMENT_AMOUNT);

    await this._unitOfWork.start();
    const session = this._unitOfWork.getSession();

    try {
      const projectWallet = await this._walletRepo.findByOwner(
        WalletOwnerType.PROJECT,
        deal.projectId
      );

      const platformWallet = await this._walletRepo.findByOwner(
        WalletOwnerType.PLATFORM,
        "PLATFORM_MAIN"
      );

      if (!projectWallet || !platformWallet) throw new NotFoundExecption(WALLET_ERRORS.NOT_FOUND);

      const platformFee = dto.amount * PLATFORM_COMMISSION_RATE;
      const founderReceives = dto.amount - platformFee;

      await this._walletRepo.incrementBalance(projectWallet._id!, founderReceives, session);
      await this._walletRepo.incrementBalance(platformWallet._id!, platformFee, session);

      await this._installmentRepo.save(
        {
          dealId: deal._id!,
          amount: dto.amount,
          platformFee,
          founderReceives,
          status: DealInstallmentStatus.PAID,
          createdAt: new Date(),
        },
        session
      );

      await this._dealRepo.incrementPaidAmount(deal._id!, dto.amount, session);

      const newRemaining = deal.remainingAmount - dto.amount;

      await this._dealRepo.update(
        deal._id!,
        {
          status: newRemaining === 0 ? DealStatus.COMPLETED : DealStatus.PARTIALLY_PAID,
        },
        session
      );

      await this._transactionRepo.save(
        {
          amount: founderReceives,
          toWalletId: projectWallet._id!,
          action: TransactionAction.CREDIT,
          reason: TransactionReason.INVESTMENT,
          status: TransactionStatus.SUCCESS,
          relatedDealId: deal._id!,
          createdAt: new Date(),
        },
        session
      );

      await this._transactionRepo.save(
        {
          amount: platformFee,
          toWalletId: platformWallet._id!,
          action: TransactionAction.CREDIT,
          reason: TransactionReason.PLATFORM_FEE,
          status: TransactionStatus.SUCCESS,
          relatedDealId: deal._id!,
          createdAt: new Date(),
        },
        session
      );

      await this._paymentRepo.save(
        {
          sessionId: dto.sessionId,
          dealId: deal._id!,
          ownerId: dto.ownerId,
          ownerRole: dto.ownerRole,
          amount: dto.amount,
          purpose: PaymentPurpose.DEAL_INSTALLMENT,
          createdAt: new Date(),
        },
        session
      );

      await this._unitOfWork.commit();
    } catch (error) {
      await this._unitOfWork.rollback();
      throw error;
    }
  }
}

import { IReleaseDealInstallmentUseCase } from "@domain/interfaces/useCases/deal/IReleaseDealInstallmentUseCase";
import { IDealRepository } from "@domain/interfaces/repositories/IDealRepository";
import { IWalletRepository } from "@domain/interfaces/repositories/IWalletRepository";
import { IDealInstallmentRepository } from "@domain/interfaces/repositories/IDealInstallmentRepository";
import { ITransactionRepository } from "@domain/interfaces/repositories/ITransactionRepository";
import { IUnitOfWork } from "@domain/interfaces/presistence/IUnitOfWork";
import { WalletOwnerType } from "@domain/enum/walletOwnerType";
import { DealStatus } from "@domain/enum/dealStatus";
import { DealInstallmentStatus } from "@domain/enum/dealInstallmentStatus";
import { TransactionAction, TransactionReason } from "@domain/enum/transactionType";
import { TransactionStatus } from "@domain/enum/transactionStatus";
import { PaymentMethod } from "@domain/enum/paymentMethod";
import { PLATFORM_COMMISSION_RATE } from "@shared/constants/platform";
import { ReleaseDealInstallmentDTO } from "application/dto/deal/releaseInstallmentDTO";
import {
  ForbiddenException,
  InvalidDataException,
  NotFoundExecption,
} from "application/constants/exceptions";
import { DEAL_ERRORS, INSTALLMENT_ERRORS, WALLET_ERRORS } from "@shared/constants/error";

export class ReleaseDealInstallmentUseCase implements IReleaseDealInstallmentUseCase {
  constructor(
    private _dealRepo: IDealRepository,
    private _walletRepo: IWalletRepository,
    private _installmentRepo: IDealInstallmentRepository,
    private _transactionRepo: ITransactionRepository,
    private _unitOfWork: IUnitOfWork
  ) {}

  async execute(investorId: string, dto: ReleaseDealInstallmentDTO): Promise<void> {
    if (dto.paymentMethod !== PaymentMethod.WALLET) {
      throw new InvalidDataException(DEAL_ERRORS.UNSUPPORTED_PAYMENT_METHOD);
    }

    // 2️⃣ Validate Deal
    const deal = await this._dealRepo.findById(dto.dealId);

    if (!deal) {
      throw new NotFoundExecption(DEAL_ERRORS.DEAL_NOT_FOUND);
    }

    if (deal.investorId !== investorId) {
      throw new ForbiddenException(DEAL_ERRORS.UNAUTHORIZED_DEAL_ACCESS);
    }

    if (deal.status === DealStatus.COMPLETED) {
      throw new InvalidDataException(DEAL_ERRORS.DEAL_ALREADY_COMPLETED);
    }

    if (dto.amount <= 0 || dto.amount > deal.remainingAmount) {
      throw new InvalidDataException(DEAL_ERRORS.INVALID_INSTALLMENT_AMOUNT);
    }

    // 3️⃣ Start Transaction (via UnitOfWork)
    await this._unitOfWork.start();
    const session = this._unitOfWork.getSession();

    try {
      // 4️⃣ Fetch Wallets
      const investorWallet = await this._walletRepo.findByOwner(
        WalletOwnerType.INVESTOR,
        investorId
      );

      const projectWallet = await this._walletRepo.findByOwner(
        WalletOwnerType.PROJECT,
        deal.projectId
      );

      const platformWallet = await this._walletRepo.findByOwner(
        WalletOwnerType.PLATFORM,
        "PLATFORM_MAIN"
      );

      if (!investorWallet || !projectWallet || !platformWallet) {
        throw new NotFoundExecption(WALLET_ERRORS.NOT_FOUND);
      }

      if (investorWallet.balance < dto.amount) {
        throw new InvalidDataException(INSTALLMENT_ERRORS.INSUFFICIENT_BALANCE);
      }

      // 5️⃣ Commission Calculation
      const platformFee = dto.amount * PLATFORM_COMMISSION_RATE;
      const founderReceives = dto.amount - platformFee;

      // 6️⃣ Wallet Movements
      await this._walletRepo.decrementBalance(investorWallet._id!, dto.amount, session!);

      await this._walletRepo.incrementBalance(projectWallet._id!, founderReceives, session!);

      await this._walletRepo.incrementBalance(platformWallet._id!, platformFee, session!);

      // 7️⃣ Create Installment Record
      await this._installmentRepo.save(
        {
          dealId: deal._id!,
          amount: dto.amount,
          platformFee,
          founderReceives,
          status: DealInstallmentStatus.PAID,
          createdAt: new Date(),
        },
        session!
      );

      // 8️⃣ Update Deal Totals
      await this._dealRepo.incrementPaidAmount(deal._id!, dto.amount, session!);

      const newRemaining = deal.remainingAmount - dto.amount;

      await this._dealRepo.update(
        deal._id!,
        {
          status: newRemaining === 0 ? DealStatus.COMPLETED : DealStatus.PARTIALLY_PAID,
        },
        session!
      );

      // 9️⃣ Ledger Entries

      await this._transactionRepo.save(
        {
          fromWalletId: investorWallet._id!,
          amount: dto.amount,
          action: TransactionAction.DEBIT,
          reason: TransactionReason.INVESTMENT,
          status: TransactionStatus.SUCCESS,
          relatedDealId: deal._id!,
          createdAt: new Date(),
        },
        session!
      );

      await this._transactionRepo.save(
        {
          toWalletId: projectWallet._id!,
          amount: founderReceives,
          action: TransactionAction.CREDIT,
          reason: TransactionReason.INVESTMENT,
          status: TransactionStatus.SUCCESS,
          relatedDealId: deal._id!,
          createdAt: new Date(),
        },
        session!
      );

      await this._transactionRepo.save(
        {
          toWalletId: platformWallet._id!,
          amount: platformFee,
          action: TransactionAction.CREDIT,
          reason: TransactionReason.PLATFORM_FEE,
          status: TransactionStatus.SUCCESS,
          relatedDealId: deal._id!,
          createdAt: new Date(),
        },
        session!
      );

      // 🔟 Commit
      await this._unitOfWork.commit();
    } catch (error) {
      await this._unitOfWork.rollback();
      throw error;
    }
  }
}

import { IEquityService } from "@domain/interfaces/services/IEquityService";
import { ICapTableRepository } from "@domain/interfaces/repositories/ICapTableRepository";
import { IShareIssuanceRepository } from "@domain/interfaces/repositories/IShareIssuanceRepository";
import { IDealRepository } from "@domain/interfaces/repositories/IDealRepository";
import { IProjectRegistrationRepository } from "@domain/interfaces/repositories/IProjectRegistrationRepository";
import { DealEntity } from "@domain/entities/deal/dealEntity";
import { InvestmentType } from "@domain/enum/investmentType";
import { ConversionStatus } from "@domain/enum/conversionStatus";
import { ProjectRegistrationStatus } from "@domain/enum/projectRegistrationStatus";
import { ClientSession } from "mongoose";
import { InvalidDataException } from "application/constants/exceptions";
import { PROJECT_ERRORS } from "@shared/constants/error";

export class EquityService implements IEquityService {
  constructor(
    private _capTableRepo: ICapTableRepository,
    private _shareIssuanceRepo: IShareIssuanceRepository,
    private _dealRepo: IDealRepository,
    private _projectRegistrationRepo: IProjectRegistrationRepository
  ) {}

  async allocateEquity(
    deal: DealEntity,
    installmentAmount: number,
    session: ClientSession
  ): Promise<void> {
    if (deal.investmentType !== InvestmentType.EQUITY) return;

    if (deal.conversionStatus === ConversionStatus.PENDING) return;

    const registration = await this._projectRegistrationRepo.findRegistrationByProjectId(
      deal.projectId,
      session
    );

    if (!registration || registration.status !== ProjectRegistrationStatus.APPROVED) {
      throw new InvalidDataException(PROJECT_ERRORS.PROJECT_NOT_ELIGIBLE_FOR_EQUITY);
    }

    const proportionalEquity = (installmentAmount / deal.totalAmount) * deal.equityPercentage;

    const newEquityAllocated = deal.equityAllocated + proportionalEquity;

    if (newEquityAllocated > deal.equityPercentage + 0.0001) {
      throw new InvalidDataException(PROJECT_ERRORS.EQUITY_OVERALLOCATION);
    }

    let capTable = await this._capTableRepo.findByProjectId(deal.projectId, session);

    if (!capTable) {
      // Create initial founder cap table
      const initialShares = 10000;

      capTable = await this._capTableRepo.save(
        {
          projectId: deal.projectId,
          totalShares: initialShares,
          shareholders: [
            {
              userId: deal.founderId,
              shares: initialShares,
              equityPercentage: 100,
            },
          ],
        },
        session
      );
    }

    const currentTotalShares = capTable.totalShares;

    // Dilution math
    // New shares to issue so investor gets proportionalEquity %

    const investorSharePercentage = proportionalEquity / 100;

    const sharesToIssue = Number(
      ((currentTotalShares * investorSharePercentage) / (1 - investorSharePercentage)).toFixed(6)
    );

    const updatedTotalShares = currentTotalShares + sharesToIssue;

    // Recalculate all shareholder percentages
    const updatedShareholders = capTable.shareholders.map((shareholder) => {
      const newPercentage = (shareholder.shares / updatedTotalShares) * 100;

      return {
        ...shareholder,
        equityPercentage: Number(newPercentage.toFixed(6)),
      };
    });

    // Add or update investor shares
    const existingInvestor = updatedShareholders.find((s) => s.userId === deal.investorId);

    if (existingInvestor) {
      existingInvestor.shares += sharesToIssue;
      existingInvestor.equityPercentage = (existingInvestor.shares / updatedTotalShares) * 100;
    } else {
      updatedShareholders.push({
        userId: deal.investorId,
        shares: sharesToIssue,
        equityPercentage: (sharesToIssue / updatedTotalShares) * 100,
      });
    }

    // Update cap table
    await this._capTableRepo.updateCapTable(
      deal.projectId,
      {
        totalShares: updatedTotalShares,
        shareholders: updatedShareholders,
      },
      session
    );

    //Create share issuance record
    await this._shareIssuanceRepo.save(
      {
        projectId: deal.projectId,
        dealId: deal._id!,
        investorId: deal.investorId,
        sharesIssued: sharesToIssue,
        equityPercentage: proportionalEquity,
        issuedAt: new Date(),
      },
      session
    );

    //Update deal equityAllocated
    await this._dealRepo.update(
      deal._id!,
      {
        equityAllocated: newEquityAllocated,
      },
      session
    );

    //Safety check — ensure cap table totals = 100%
    const totalPercentage = updatedShareholders.reduce((acc, s) => acc + s.equityPercentage, 0);

    if (Math.abs(totalPercentage - 100) > 0.01) {
      throw new InvalidDataException(PROJECT_ERRORS.CAPTBLE_IMBALANCE);
    }
  }
}

import { ClientSession, Model } from "mongoose";
import { BaseRepository } from "./baseRepository";
import { IDealRepository } from "@domain/interfaces/repositories/IDealRepository";
import { IDealModel } from "@infrastructure/db/models/dealModel";
import { DealEntity } from "@domain/entities/deal/dealEntity";
import { DealMapper } from "application/mappers/dealMapper";
import { InvestorPortfolioItemDTO } from "application/dto/dashboard/investorPortfolioDTO";

export class DealRepository
  extends BaseRepository<DealEntity, IDealModel>
  implements IDealRepository
{
  constructor(protected _model: Model<IDealModel>) {
    super(_model, DealMapper);
  }

  async findByOfferId(offerId: string): Promise<DealEntity | null> {
    const doc = await this._model.findOne({ offerId });
    return doc ? DealMapper.fromMongooseDocument(doc) : null;
  }

  async incrementPaidAmount(
    dealId: string,
    amount: number,
    session?: ClientSession
  ): Promise<void> {
    const deal = await this._model.findById(dealId).session(session!);

    if (!deal) {
      throw new Error("Deal not found");
    }

    if (deal.remainingAmount < amount) {
      throw new Error("Overpayment not allowed");
    }

    await this._model.updateOne(
      { _id: dealId },
      {
        $inc: {
          amountPaid: amount,
          remainingAmount: -amount,
        },
      },
      session ? { session } : {}
    );
  }

  async findByInvestorId(investorId: string): Promise<DealEntity[]> {
    const docs = await this._model.find({ investorId }).sort({ createdAt: -1 });

    return docs.map(DealMapper.fromMongooseDocument);
  }

  async findByFounderId(founderId: string): Promise<DealEntity[]> {
    const docs = await this._model.find({ founderId }).sort({ createdAt: -1 });

    return docs.map(DealMapper.fromMongooseDocument);
  }

  async countByStatus(status: string): Promise<number> {
    return this._model.countDocuments({ status });
  }

  async findByProjectId(projectId: string): Promise<DealEntity[]> {
    const docs = await this._model.find({ projectId }).sort({ createdAt: -1 });

    return docs.map(DealMapper.fromMongooseDocument);
  }

  async findInvestorPortfolio(investorId: string): Promise<InvestorPortfolioItemDTO[]> {
    const docs = await this._model
      .find({ investorId })
      .populate("projectId", "startupName logoUrl stage")
      .sort({ createdAt: -1 });

    return docs.map((doc) => {
      const project = doc.projectId as unknown as {
        _id: string;
        startupName: string;
        logoUrl?: string;
        stage: string;
      };

      return {
        projectId: project._id.toString(),
        startupName: project.startupName,
        stage: project.stage,
        investedAmount: doc.amountPaid,
        equity: doc.equityPercentage,
        status: doc.status,
        logo: project.logoUrl || "",
      };
    });
  }
}

import { ClientSession, Model } from "mongoose";
import { BaseRepository } from "./baseRepository";
import { IDealRepository } from "@domain/interfaces/repositories/IDealRepository";
import { IDealModel } from "@infrastructure/db/models/dealModel";
import { DealEntity } from "@domain/entities/deal/dealEntity";
import { DealMapper } from "application/mappers/dealMapper";
import { InvestorPortfolioItemDTO } from "application/dto/dashboard/investorPortfolioDTO";
import { InvestmentChartData } from "application/dto/dashboard/investmentChartDTO";

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
    const result = await this._model.aggregate([
      {
        $match: { investorId },
      },
      {
        $lookup: {
          from: "projects",
          localField: "projectId",
          foreignField: "_id",
          as: "project",
        },
      },
      {
        $unwind: "$project",
      },
      {
        $project: {
          projectId: "$project._id",
          startupName: "$project.startupName",
          stage: "$project.stage",
          investedAmount: "$amountPaid",
          equity: "$equityPercentage",
          status: "$status",
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    return result;
  }

  async findInvestmentChart(investorId: string): Promise<InvestmentChartData[]> {
    const result = await this._model.aggregate([
      {
        $match: { investorId },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalInvested: { $sum: "$amountPaid" },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    return result.map((item) => ({
      year: item._id.year,
      month: item._id.month,
      totalInvested: item.totalInvested,
    }));
  }
}

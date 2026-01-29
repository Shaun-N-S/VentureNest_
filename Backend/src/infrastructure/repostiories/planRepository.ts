import { Model } from "mongoose";
import { BaseRepository } from "./baseRepository";
import { IPlanRepository } from "@domain/interfaces/repositories/IPlanRepository";
import { PlanEntity } from "@domain/entities/plan/planEntity";
import { IPlanModel } from "@infrastructure/db/models/planModel";
import { PlanMapper } from "application/mappers/planMapper";
import { PlanRole } from "@domain/enum/planRole";
import { PlanStatus } from "@domain/enum/planStatus";

export class PlanRepository
  extends BaseRepository<PlanEntity, IPlanModel>
  implements IPlanRepository
{
  constructor(protected _model: Model<IPlanModel>) {
    super(_model, PlanMapper);
  }

  async findByRole(role: PlanRole): Promise<PlanEntity[]> {
    const docs = await this._model
      .find({ role, status: PlanStatus.ACTIVE })
      .sort({ "billing.price": 1 });

    return docs.map((doc) => PlanMapper.fromMongooseDocument(doc));
  }

  async updateStatus(planId: string, status: PlanStatus): Promise<PlanEntity | null> {
    const updated = await this._model.findByIdAndUpdate(planId, { status }, { new: true });

    return updated ? PlanMapper.fromMongooseDocument(updated) : null;
  }

  async findAllPlans(
    skip: number,
    limit: number,
    status?: string,
    search?: string
  ): Promise<PlanEntity[]> {
    const query: any = {};
    if (status) query.status = status;
    if (search) query.name = { $regex: search, $options: "i" };

    const docs = await this._model.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });

    return docs.map((doc) => PlanMapper.fromMongooseDocument(doc));
  }

  async countPlans(status?: string, search?: string): Promise<number> {
    const query: any = {};
    if (status) query.status = status;
    if (search) query.name = { $regex: search, $options: "i" };

    return this._model.countDocuments(query);
  }
}

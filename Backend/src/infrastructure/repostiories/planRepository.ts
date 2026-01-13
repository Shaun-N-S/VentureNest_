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

  /**
   * Get plans by role (User / Investor)
   * Used for public plan listing
   */
  async findByRole(role: PlanRole): Promise<PlanEntity[]> {
    const docs = await this._model
      .find({ role, status: PlanStatus.ACTIVE })
      .sort({ "billing.price": 1 });

    return docs.map((doc) => PlanMapper.fromMongooseDocument(doc));
  }

  /**
   * Activate / Deactivate plan
   * Admin-only operation
   */
  async updateStatus(planId: string, status: PlanStatus): Promise<PlanEntity | null> {
    const updated = await this._model.findByIdAndUpdate(planId, { status }, { new: true });

    return updated ? PlanMapper.fromMongooseDocument(updated) : null;
  }
}

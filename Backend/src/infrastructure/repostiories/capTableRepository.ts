import { Model, ClientSession } from "mongoose";
import { BaseRepository } from "./baseRepository";
import { ICapTableRepository } from "@domain/interfaces/repositories/ICapTableRepository";
import { ICapTableModel } from "@infrastructure/db/models/capTableModel";
import { CapTableMapper } from "application/mappers/capTableMapper";
import { CapTableEntity } from "@domain/entities/investor/capTableEntity";

export class CapTableRepository
  extends BaseRepository<CapTableEntity, ICapTableModel>
  implements ICapTableRepository
{
  constructor(protected _model: Model<ICapTableModel>) {
    super(_model, CapTableMapper);
  }

  async findByProjectId(
    projectId: string,
    session?: ClientSession
  ): Promise<CapTableEntity | null> {
    const doc = await this._model.findOne({ projectId }).session(session!);
    return doc ? CapTableMapper.fromMongooseDocument(doc) : null;
  }

  async updateCapTable(
    projectId: string,
    data: Partial<CapTableEntity>,
    session?: ClientSession
  ): Promise<CapTableEntity | null> {
    const updated = await this._model.findOneAndUpdate({ projectId }, data, {
      new: true,
      ...(session && { session }),
    });

    return updated ? CapTableMapper.fromMongooseDocument(updated) : null;
  }
}

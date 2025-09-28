import { IBaseRepository } from "domain/interfaces/repositories/IBaseRepository";
import { Model } from "mongoose";

export abstract class BaseRepository<T> implements IBaseRepository<T> {
  constructor(protected _model: Model<T>) {}

  async save(data: T): Promise<T> {
    return (await this._model.create(data)) as T;
  }

  async findById(id: string): Promise<T | null> {
    return await this._model.findById(id);
  }
}

import { Model, Document } from "mongoose";

export abstract class BaseRepository<TEntity, TModel extends Document> {
  constructor(protected _model: Model<TModel>) {}

  abstract save(data: TEntity): Promise<TEntity>;
  abstract findById(id: string): Promise<TEntity | null>;
  abstract findAll(
    skip?: number,
    limit?: number,
    status?: string,
    search?: string
  ): Promise<TEntity[]>;
  abstract count(status?: string, search?: string): Promise<number>;
}

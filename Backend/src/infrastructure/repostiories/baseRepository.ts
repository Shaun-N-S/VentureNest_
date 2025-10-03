// import { IBaseRepository } from "domain/interfaces/repositories/IBaseRepository";
// import { Model } from "mongoose";

// export abstract class BaseRepository<TEntity, TModel extends Document>
//   implements IBaseRepository<TEntity>
// {
//   constructor(protected _model: Model<TModel>) {}

//   async save(data: TEntity): Promise<TEntity> {
//     return (await this._model.create(data)) as TEntity;
//   }

//   async findById(id: string): Promise<TEntity | null> {
//     return await this._model.findById(id);
//   }
// }

import { Model, Document } from "mongoose";

export abstract class BaseRepository<TEntity, TModel extends Document> {
  constructor(protected _model: Model<TModel>) {}

  abstract save(data: TEntity): Promise<TEntity>;
  abstract findById(id: string): Promise<TEntity | null>;
}

import { Model, Document, UpdateQuery } from "mongoose";

export abstract class BaseRepository<TEntity, TModel extends Document> {
  constructor(
    protected _model: Model<TModel>,
    private mapper: any
  ) {}

  async save(data: TEntity): Promise<TEntity> {
    const doc = this.mapper.toMongooseDocument(data);
    const saved = await this._model.create(doc);
    return this.mapper.fromMongooseDocument(saved);
  }

  async findById(id: string): Promise<TEntity | null> {
    const doc = await this._model.findById(id);
    if (!doc) return null;
    return this.mapper.fromMongooseDocument(doc);
  }

  async findAll(
    skip = 0,
    limit = 10,
    status?: string,
    search?: string,
    extraQuery: any = {}
  ): Promise<TEntity[]> {
    const query: any = { ...extraQuery };

    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const docs = await this._model.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });

    return docs.map((doc) => this.mapper.fromMongooseDocument(doc));
  }

  async count(status?: string, search?: string, extraQuery: any = {}): Promise<number> {
    const query: any = { ...extraQuery };

    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    return await this._model.countDocuments(query);
  }

  async update(id: string, data: Partial<TEntity>): Promise<TEntity | null> {
    // const updateDoc = this.mapper.toMongooseDocument({ id, ...data });

    const updated = await this._model.findByIdAndUpdate(id, data as UpdateQuery<Document>, {
      new: true,
    });

    return updated ? this.mapper.fromMongooseDocument(updated) : null;
  }
}

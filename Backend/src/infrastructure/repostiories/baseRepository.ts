import mongoose, { Model, Document, UpdateQuery, ClientSession, QueryOptions } from "mongoose";

export abstract class BaseRepository<TEntity, TModel extends Document> {
  constructor(
    protected _model: Model<TModel>,
    private mapper: any
  ) {}

  async save(data: TEntity, session?: ClientSession): Promise<TEntity> {
    const doc = this.mapper.toMongooseDocument(data);

    const savedDocs = session
      ? await this._model.create([doc], { session })
      : await this._model.create([doc]);

    return this.mapper.fromMongooseDocument(savedDocs[0]);
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
    console.log(query);
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { userName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    console.log(JSON.stringify(query));
    const docs = await this._model.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });

    return docs.map((doc) => this.mapper.fromMongooseDocument(doc));
  }

  async count(status?: string, search?: string, extraQuery: any = {}): Promise<number> {
    const query: any = { ...extraQuery };

    if (status) query.kycStatus = status;

    if (search) {
      query.$or = [
        { userName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    return await this._model.countDocuments(query);
  }

  async findByIds(ids: string[]): Promise<TEntity[]> {
    if (!ids.length) return [];

    const docs = await this._model.find({
      _id: { $in: ids.map((id) => new mongoose.Types.ObjectId(id)) },
    });

    return docs.map((doc) => this.mapper.fromMongooseDocument(doc as TModel));
  }

  async update(
    id: string,
    data: Partial<TEntity>,
    session?: ClientSession
  ): Promise<TEntity | null> {
    const options: QueryOptions<TModel> = {
      new: true,
      ...(session ? { session } : {}),
    };

    const updated = await this._model.findByIdAndUpdate(id, data as UpdateQuery<TModel>, options);

    return updated ? this.mapper.fromMongooseDocument(updated) : null;
  }
}

import { UserEntity } from "domain/entities/user/userEntity";
import { BaseRepository } from "./baseRepository";
import { IUserRepository } from "domain/interfaces/repositories/IUserRepository";
import { Model } from "mongoose";
import { UserMapper } from "application/mappers/userMappers";
import { IUserModel } from "@infrastructure/db/models/userModel";

export class UserRepository extends BaseRepository<IUserModel> implements IUserRepository {
  constructor(protected _model: Model<IUserModel>) {
    super(_model);
  }
  async findByEmail(email: string): Promise<UserEntity | null> {
    const doc = await this._model.findOne({ email });
    if (!doc) return null;
    return UserMapper.fromMongooseDocument(doc);
  }
}

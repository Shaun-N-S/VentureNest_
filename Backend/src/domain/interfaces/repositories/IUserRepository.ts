import { UserEntity } from "domain/entities/user/userEntity";
import { IBaseRepository } from "./IBaseRepository";
import { IUserModel } from "@infrastructure/db/models/userModel";

export interface IUserRepository extends IBaseRepository<UserEntity> {
  findByEmail(email: string): Promise<UserEntity | null>;
}

import { UserEntity } from "domain/entities/user/userEntity";
import { IBaseRepository } from "./IBaseRepository";
import { UserStatus } from "@domain/enum/userStatus";

export interface IUserRepository extends IBaseRepository<UserEntity> {
  findByEmail(email: string): Promise<UserEntity | null>;
  findByIdAndUpdatePassword(email: string, password: string): Promise<void>;
  updateStatus(userId: string, status: UserStatus): Promise<UserEntity | null>;
}

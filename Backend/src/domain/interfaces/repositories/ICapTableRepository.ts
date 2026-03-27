import { CapTableEntity } from "@domain/entities/investor/capTableEntity";
import { IBaseRepository } from "./IBaseRepository";
import { ClientSession } from "mongoose";

export interface ICapTableRepository extends IBaseRepository<CapTableEntity> {
  findByProjectId(projectId: string, session?: ClientSession): Promise<CapTableEntity | null>;

  updateCapTable(
    projectId: string,
    data: Partial<CapTableEntity>,
    session?: ClientSession
  ): Promise<CapTableEntity | null>;
}

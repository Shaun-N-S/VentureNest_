import { ShareIssuanceEntity } from "@domain/entities/investor/shareIssuanceEntity";
import { IBaseRepository } from "./IBaseRepository";

export interface IShareIssuanceRepository extends IBaseRepository<ShareIssuanceEntity> {
  findByProjectId(projectId: string): Promise<ShareIssuanceEntity[]>;
  findByDealId(dealId: string): Promise<ShareIssuanceEntity[]>;
}

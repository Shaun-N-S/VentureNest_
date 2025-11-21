import { RelationshipResDTO } from "application/dto/relationship/relationshipDTO";

export interface ISendConnectionReqUseCase {
  execute(fromUserId: string, toUserId: string): Promise<RelationshipResDTO>;
}

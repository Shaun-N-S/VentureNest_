import { RelationshipResDTO } from "application/dto/relationship/relationshipDTO";

export interface IFollowUserUseCase {
  execute(fromUserId: string, toUserId: string): Promise<RelationshipResDTO>;
}

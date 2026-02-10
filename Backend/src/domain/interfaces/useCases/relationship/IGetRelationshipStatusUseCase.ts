import { RelationshipStatusDTO } from "application/dto/relationship/relationshipStatusDTO";

export interface IGetRelationshipStatusUseCase {
  execute(currentUserId: string, targetUserId: string): Promise<RelationshipStatusDTO>;
}

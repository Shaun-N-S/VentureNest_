import { ConnectionStatus, RelationshipType } from "@domain/enum/connectionStatus";
import { IRelationshipRepository } from "@domain/interfaces/repositories/IRelationshipRepository";
import { IGetRelationshipStatusUseCase } from "@domain/interfaces/useCases/relationship/IGetRelationshipStatusUseCase";
import { RelationshipStatusDTO } from "application/dto/relationship/relationshipStatusDTO";

export class GetRelationshipStatusUseCase implements IGetRelationshipStatusUseCase {
  constructor(private readonly _relationshipRepository: IRelationshipRepository) {}

  async execute(currentUserId: string, targetUserId: string): Promise<RelationshipStatusDTO> {
    const relationship = await this._relationshipRepository.findBetweenUsers(
      currentUserId,
      targetUserId
    );

    if (!relationship) {
      return {
        isConnected: false,
        type: RelationshipType.CONNECTION,
        status: ConnectionStatus.NONE,
      };
    }

    return {
      isConnected: relationship.status === ConnectionStatus.ACCEPTED,
      type: relationship.type,
      status: relationship.status,
    };
  }
}

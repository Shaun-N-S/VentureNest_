import { RelationshipType } from "@domain/enum/connectionStatus";
import { IRelationshipRepository } from "@domain/interfaces/repositories/IRelationshipRepository";
import { IFollowUserUseCase } from "@domain/interfaces/useCases/relationship/IFollowUserUseCase";
import { RelationshipResDTO } from "application/dto/relationship/relationshipDTO";
import { RelationshipMapper } from "application/mappers/relationshipMapper";

export class FollowUserUseCase implements IFollowUserUseCase {
  constructor(private _relationshipRepo: IRelationshipRepository) {}

  async execute(fromUserId: string, toUserId: string): Promise<RelationshipResDTO> {
    const existing = await this._relationshipRepo.findRelationship(
      fromUserId,
      toUserId,
      RelationshipType.FOLLOW
    );

    if (existing) return RelationshipMapper.toDTO(existing);

    const entity = RelationshipMapper.createToEntity({
      fromUserId,
      toUserId,
      type: RelationshipType.FOLLOW,
    });

    const saved = await this._relationshipRepo.save(entity);
    return RelationshipMapper.toDTO(saved);
  }
}

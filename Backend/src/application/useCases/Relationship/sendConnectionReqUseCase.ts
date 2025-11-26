import { RelationshipType } from "@domain/enum/connectionStatus";
import { IRelationshipRepository } from "@domain/interfaces/repositories/IRelationshipRepository";
import { ISendConnectionReqUseCase } from "@domain/interfaces/useCases/relationship/ISendConnectionReqUseCase";
import { RelationshipResDTO } from "application/dto/relationship/relationshipDTO";
import { RelationshipMapper } from "application/mappers/relationshipMapper";

export class SendConnectionReqUseCase implements ISendConnectionReqUseCase {
  constructor(private _relationshipRepo: IRelationshipRepository) {}

  async execute(fromUserId: string, toUserId: string): Promise<RelationshipResDTO> {
    const existing = await this._relationshipRepo.findRelationship(
      fromUserId,
      toUserId,
      RelationshipType.CONNECTION
    );
    console.log("existing     : ", existing);

    if (existing) return RelationshipMapper.toDTO(existing);

    const entity = RelationshipMapper.createToEntity({
      fromUserId,
      toUserId,
      type: RelationshipType.CONNECTION,
    });
    console.log("entity : : :   ", entity);

    const saved = await this._relationshipRepo.save(entity);
    console.log("saved    :  ", saved);
    return RelationshipMapper.toDTO(saved);
  }
}

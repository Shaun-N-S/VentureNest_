import { RelationshipType, ConnectionStatus } from "@domain/enum/connectionStatus";
import { InvalidDataException } from "application/constants/exceptions";
import { RELATIONSHIP_ERRORS } from "@shared/constants/error";
import { RelationshipMapper } from "application/mappers/relationshipMapper";
import { ISendConnectionReqUseCase } from "@domain/interfaces/useCases/relationship/ISendConnectionReqUseCase";
import { IRelationshipRepository } from "@domain/interfaces/repositories/IRelationshipRepository";
import { RelationshipResDTO } from "application/dto/relationship/relationshipDTO";

export class SendConnectionReqUseCase implements ISendConnectionReqUseCase {
  constructor(private _relationshipRepo: IRelationshipRepository) {}

  async execute(fromUserId: string, toUserId: string): Promise<RelationshipResDTO> {
    const existing = await this._relationshipRepo.findRelationship(
      fromUserId,
      toUserId,
      RelationshipType.CONNECTION
    );

    if (existing) {
      switch (existing.status) {
        case ConnectionStatus.PENDING:
          throw new InvalidDataException(RELATIONSHIP_ERRORS.CONNECTION_ALREADY_PENDING);

        case ConnectionStatus.ACCEPTED:
          throw new InvalidDataException(RELATIONSHIP_ERRORS.ALREADY_CONNECTED);

        case ConnectionStatus.REJECTED:
          await this._relationshipRepo.updateConnectionStatus(
            fromUserId,
            toUserId,
            ConnectionStatus.PENDING
          );

          return RelationshipMapper.toDTO({
            ...existing,
            status: ConnectionStatus.PENDING,
          });
      }
    }

    const entity = RelationshipMapper.createToEntity({
      fromUserId,
      toUserId,
      type: RelationshipType.CONNECTION,
    });

    const saved = await this._relationshipRepo.save(entity);
    return RelationshipMapper.toDTO(saved);
  }
}

import { ConnectionStatus } from "@domain/enum/connectionStatus";
import { IRelationshipRepository } from "@domain/interfaces/repositories/IRelationshipRepository";
import { IUpdateConnectionReqStatusUseCase } from "@domain/interfaces/useCases/relationship/IUpdateConnectionReqStatusUseCase";
import { Errors, RELATIONSHIP_ERRORS } from "@shared/constants/error";
import { InvalidDataException, NotFoundExecption } from "application/constants/exceptions";

export class UpdateConnectionReqStatusUseCase implements IUpdateConnectionReqStatusUseCase {
  constructor(private _relationshipRepo: IRelationshipRepository) {}

  async execute(fromUserId: string, toUserId: string, status: string): Promise<boolean> {
    if (!Object.values(ConnectionStatus).includes(status as ConnectionStatus)) {
      throw new InvalidDataException(Errors.NO_STATUS_FOUND);
    }

    const existing = await this._relationshipRepo.checkExisting(fromUserId, toUserId);

    if (!existing) {
      throw new NotFoundExecption(RELATIONSHIP_ERRORS.NO_RELATIONSHIP_EXIST);
    }

    const updated = await this._relationshipRepo.updateConnectionStatus(
      fromUserId,
      toUserId,
      status as ConnectionStatus
    );

    return updated!;
  }
}

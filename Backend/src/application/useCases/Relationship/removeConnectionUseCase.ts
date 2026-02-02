import { IRemoveConnectionUseCase } from "@domain/interfaces/useCases/relationship/IRemoveConnectionUseCase";
import { IRelationshipRepository } from "@domain/interfaces/repositories/IRelationshipRepository";
import { InvalidDataException } from "application/constants/exceptions";
import { Errors } from "@shared/constants/error";

export class RemoveConnectionUseCase implements IRemoveConnectionUseCase {
  constructor(private _relationshipRepository: IRelationshipRepository) {}

  async execute(currentUserId: string, targetUserId: string): Promise<boolean> {
    if (!currentUserId || !targetUserId) {
      throw new InvalidDataException(Errors.INVALID_DATA);
    }

    return await this._relationshipRepository.removeConnection(currentUserId, targetUserId);
  }
}

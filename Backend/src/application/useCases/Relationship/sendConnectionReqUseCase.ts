import { RelationshipType, ConnectionStatus } from "@domain/enum/connectionStatus";
import { InvalidDataException } from "application/constants/exceptions";
import { RELATIONSHIP_ERRORS } from "@shared/constants/error";
import { RelationshipMapper } from "application/mappers/relationshipMapper";
import { ISendConnectionReqUseCase } from "@domain/interfaces/useCases/relationship/ISendConnectionReqUseCase";
import { IRelationshipRepository } from "@domain/interfaces/repositories/IRelationshipRepository";
import { RelationshipResDTO } from "application/dto/relationship/relationshipDTO";
import { UserRole } from "@domain/enum/userRole";
import { NotificationType } from "@domain/enum/notificationType";
import { NotificationEntityType } from "@domain/enum/notificationEntityType";
import { ICreateNotificationUseCase } from "@domain/interfaces/useCases/notification/ICreateNotificationUseCase";

export class SendConnectionReqUseCase implements ISendConnectionReqUseCase {
  constructor(
    private _relationshipRepo: IRelationshipRepository,
    private _notificationUseCase: ICreateNotificationUseCase
  ) {}

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
    await this._notificationUseCase.createNotification({
      recipientId: toUserId,
      recipientRole: UserRole.USER,

      actorId: fromUserId,
      actorRole: UserRole.USER,

      type: NotificationType.CONNECTION_REQUEST,

      entityId: fromUserId,
      entityType: NotificationEntityType.USER,

      message: "sent you a connection request",
    });

    return RelationshipMapper.toDTO(saved);
  }
}

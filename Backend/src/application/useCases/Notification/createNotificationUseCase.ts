import { ICreateNotificationUseCase } from "@domain/interfaces/useCases/notification/ICreateNotificationUseCase";
import { INotificationRepository } from "@domain/interfaces/repositories/INotificationRepository";
import { NotificationMapper } from "application/mappers/notificationMapper";
import { NotificationResponseDTO } from "application/dto/notification/notificationResponseDTO";
import { io } from "@infrastructure/realtime/socketServer";
import { SocketRooms } from "@infrastructure/realtime/socketRooms";
import { CreateNotificationDTO } from "application/dto/notification/createNotificationDTO";

export class CreateNotificationUseCase implements ICreateNotificationUseCase {
  constructor(private _notificationRepo: INotificationRepository) {}

  async createNotification(data: CreateNotificationDTO): Promise<NotificationResponseDTO> {
    const entity = NotificationMapper.toEntity(data);
    console.log(" Creating notification:", data);

    const saved = await this._notificationRepo.save(entity);

    const response = NotificationMapper.toResponseDTO(saved);

    io.to(SocketRooms.user(saved.recipientId)).emit("notification:new", response);

    return response;
  }
}

import { notificationModel } from "@infrastructure/db/models/notificationModel";
import { NotificationRepository } from "@infrastructure/repostiories/notificationRepository";
import { GetNotificationsUseCase } from "application/useCases/Notification/getNotificationsUseCase";
import { GetUnreadNotificationCountUseCase } from "application/useCases/Notification/getUnreadNotificationCountUseCase";
import { MarkAllNotificationsReadUseCase } from "application/useCases/Notification/markAllNotificationsReadUseCase";
import { MarkNotificationReadUseCase } from "application/useCases/Notification/markNotificationReadUseCase";
import { NotificationController } from "interfaceAdapters/controller/Notification/notificationController";

const notificationRepo = new NotificationRepository(notificationModel);

const getNotificationsUseCase = new GetNotificationsUseCase(notificationRepo);
const markNotificationReadUseCase = new MarkNotificationReadUseCase(notificationRepo);
const markAllNotificationReadUseCase = new MarkAllNotificationsReadUseCase(notificationRepo);
const getUnreadNotificationCountUseCase = new GetUnreadNotificationCountUseCase(notificationRepo);

export const notificationController = new NotificationController(
  getNotificationsUseCase,
  markNotificationReadUseCase,
  markAllNotificationReadUseCase,
  getUnreadNotificationCountUseCase
);

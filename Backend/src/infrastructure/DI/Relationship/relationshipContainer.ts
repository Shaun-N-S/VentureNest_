import { investorModel } from "@infrastructure/db/models/investorModel";
import { notificationModel } from "@infrastructure/db/models/notificationModel";
import { relationshipModel } from "@infrastructure/db/models/relationshipModel";
import { userModel } from "@infrastructure/db/models/userModel";
import { InvestorRepository } from "@infrastructure/repostiories/investorRepository";
import { NotificationRepository } from "@infrastructure/repostiories/notificationRepository";
import { RelationshipRepository } from "@infrastructure/repostiories/relationshipRepository";
import { UserRepository } from "@infrastructure/repostiories/userRepository";
import { StorageService } from "@infrastructure/services/storageService";
import { CreateNotificationUseCase } from "application/useCases/Notification/createNotificationUseCase";
import { GetConnectionReqUseCase } from "application/useCases/Relationship/getConnectionReqUseCase";
import { GetConnectionsPeopleListUseCase } from "application/useCases/Relationship/GetConnectionsPeopleListUseCase";
import { GetNetworkUsersUseCase } from "application/useCases/Relationship/getNetworkUsersUseCase";
import { GetRelationshipStatusUseCase } from "application/useCases/Relationship/getRelationshipStatusUseCase";
import { RemoveConnectionUseCase } from "application/useCases/Relationship/removeConnectionUseCase";
import { SendConnectionReqUseCase } from "application/useCases/Relationship/sendConnectionReqUseCase";
import { UpdateConnectionReqStatusUseCase } from "application/useCases/Relationship/UpdateConnectionReqStatusUseCase";
import { RelationshipController } from "interfaceAdapters/controller/Relationship/relationshipController";

const relationshipRepo = new RelationshipRepository(relationshipModel);
const userRepo = new UserRepository(userModel);
const investorRepo = new InvestorRepository(investorModel);
const storageService = new StorageService();
const notificationRepo = new NotificationRepository(notificationModel);

const createNotificationUseCase = new CreateNotificationUseCase(notificationRepo);
const sendConnectionReqUseCase = new SendConnectionReqUseCase(
  relationshipRepo,
  createNotificationUseCase
);
const getNetworkUseCase = new GetNetworkUsersUseCase(
  userRepo,
  investorRepo,
  relationshipRepo,
  storageService
);
const getConnectionReqUseCase = new GetConnectionReqUseCase(
  relationshipRepo,
  userRepo,
  investorRepo,
  storageService
);
const updateConnectionReqStatusUseCase = new UpdateConnectionReqStatusUseCase(relationshipRepo);
const getConnectionsPeopleListUseCase = new GetConnectionsPeopleListUseCase(
  relationshipRepo,
  userRepo,
  investorRepo,
  storageService
);
const removeConnectionUseCase = new RemoveConnectionUseCase(relationshipRepo);
const getRelationshipStatusUseCase = new GetRelationshipStatusUseCase(relationshipRepo);

export const relationshipController = new RelationshipController(
  sendConnectionReqUseCase,
  getNetworkUseCase,
  getConnectionReqUseCase,
  updateConnectionReqStatusUseCase,
  getConnectionsPeopleListUseCase,
  removeConnectionUseCase,
  getRelationshipStatusUseCase
);

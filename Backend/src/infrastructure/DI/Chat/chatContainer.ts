import { conversationModel } from "@infrastructure/db/models/conversationModel";
import { investorModel } from "@infrastructure/db/models/investorModel";
import { messageModel } from "@infrastructure/db/models/messageModel";
import { userModel } from "@infrastructure/db/models/userModel";
import { SocketChatPublisher } from "@infrastructure/realtime/Publishers/socketChatPublisher";
import { ConversationRepository } from "@infrastructure/repostiories/conversationRepository";
import { InvestorRepository } from "@infrastructure/repostiories/investorRepository";
import { MessageRepository } from "@infrastructure/repostiories/messageRepository";
import { UserRepository } from "@infrastructure/repostiories/userRepository";
import { StorageService } from "@infrastructure/services/storageService";
import { CreateConversationUseCase } from "application/useCases/Chat/createConversationUseCase";
import { GetMessagesUseCase } from "application/useCases/Chat/getMessagesUseCase";
import { GetUnreadCountUseCase } from "application/useCases/Chat/getUnreadCountUseCase";
import { GetUserConversationsUseCase } from "application/useCases/Chat/getUserConversationsUseCase";
import { MarkConversationReadUseCase } from "application/useCases/Chat/markConversationReadUseCase";
import { SendMessageUseCase } from "application/useCases/Chat/sendMessageUseCase";
import { UpdateLastSeenUseCase } from "application/useCases/Chat/updateLastSeenUseCase";
import { ChatController } from "interfaceAdapters/controller/Chat/chatController";

const conversationRepo = new ConversationRepository(conversationModel);
const messageRepo = new MessageRepository(messageModel);
const userRepo = new UserRepository(userModel);
const investorRepo = new InvestorRepository(investorModel);
const chatPublisher = new SocketChatPublisher();
const storageService = new StorageService();

const createConversationUseCase = new CreateConversationUseCase(conversationRepo);
const sendMessageUseCase = new SendMessageUseCase(
  messageRepo,
  conversationRepo,
  chatPublisher,
  storageService
);
const getUserConversationsUseCase = new GetUserConversationsUseCase(
  conversationRepo,
  storageService
);
const markConversationReadUseCase = new MarkConversationReadUseCase(messageRepo);
const getMessagesUseCase = new GetMessagesUseCase(messageRepo, storageService);
const getUnreadCountUseCase = new GetUnreadCountUseCase(messageRepo);
export const updateLastSeenUseCase = new UpdateLastSeenUseCase(userRepo, investorRepo);

export const chatController = new ChatController(
  createConversationUseCase,
  sendMessageUseCase,
  getUserConversationsUseCase,
  getMessagesUseCase,
  markConversationReadUseCase,
  getUnreadCountUseCase
);

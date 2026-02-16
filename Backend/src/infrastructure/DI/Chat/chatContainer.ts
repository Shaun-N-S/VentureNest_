import { conversationModel } from "@infrastructure/db/models/conversationModel";
import { messageModel } from "@infrastructure/db/models/messageModel";
import { SocketChatPublisher } from "@infrastructure/realtime/Publishers/socketChatPublisher";
import { ConversationRepository } from "@infrastructure/repostiories/conversationRepository";
import { MessageRepository } from "@infrastructure/repostiories/messageRepository";
import { StorageService } from "@infrastructure/services/storageService";
import { CreateConversationUseCase } from "application/useCases/Chat/createConversationUseCase";
import { GetMessagesUseCase } from "application/useCases/Chat/getMessagesUseCase";
import { GetUnreadCountUseCase } from "application/useCases/Chat/getUnreadCountUseCase";
import { GetUserConversationsUseCase } from "application/useCases/Chat/getUserConversationsUseCase";
import { MarkConversationReadUseCase } from "application/useCases/Chat/markConversationReadUseCase";
import { SendMessageUseCase } from "application/useCases/Chat/sendMessageUseCase";
import { ChatController } from "interfaceAdapters/controller/Chat/chatController";

const conversationRepo = new ConversationRepository(conversationModel);
const messageRepo = new MessageRepository(messageModel);
const chatPublisher = new SocketChatPublisher();
const storageService = new StorageService();

const createConversationUseCase = new CreateConversationUseCase(conversationRepo);
const sendMessageUseCase = new SendMessageUseCase(messageRepo, conversationRepo, chatPublisher);
const getUserConversationsUseCase = new GetUserConversationsUseCase(
  conversationRepo,
  storageService
);
const markConversationReadUseCase = new MarkConversationReadUseCase(messageRepo);
const getMessagesUseCase = new GetMessagesUseCase(messageRepo);
const getUnreadCountUseCase = new GetUnreadCountUseCase(messageRepo);

export const chatController = new ChatController(
  createConversationUseCase,
  sendMessageUseCase,
  getUserConversationsUseCase,
  getMessagesUseCase,
  markConversationReadUseCase,
  getUnreadCountUseCase
);

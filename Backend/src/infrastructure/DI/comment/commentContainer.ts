import { commentModel } from "@infrastructure/db/models/commentModel";
import { investorModel } from "@infrastructure/db/models/investorModel";
import { notificationModel } from "@infrastructure/db/models/notificationModel";
import { postModel } from "@infrastructure/db/models/postModel";
import { userModel } from "@infrastructure/db/models/userModel";
import { CommentRepository } from "@infrastructure/repostiories/commentRepository";
import { InvestorRepository } from "@infrastructure/repostiories/investorRepository";
import { NotificationRepository } from "@infrastructure/repostiories/notificationRepository";
import { PostRepository } from "@infrastructure/repostiories/postRepository";
import { UserRepository } from "@infrastructure/repostiories/userRepository";
import { StorageService } from "@infrastructure/services/storageService";
import { CreateCommentUseCase } from "application/useCases/comment/CreateCommentUseCase";
import { GetCommentsUseCase } from "application/useCases/comment/getCommentUseCase";
import { LikeCommentUseCase } from "application/useCases/comment/likeCommentUseCase";
import { CreateNotificationUseCase } from "application/useCases/Notification/createNotificationUseCase";
import { CommentController } from "interfaceAdapters/controller/Comment/commentController";

const commentRepo = new CommentRepository(commentModel);
const postRepo = new PostRepository(postModel);
const userRepo = new UserRepository(userModel);
const investorRepo = new InvestorRepository(investorModel);
const storageService = new StorageService();
const notificationRepo = new NotificationRepository(notificationModel);

const createNotificationUseCase = new CreateNotificationUseCase(notificationRepo);
const createCommentUseCase = new CreateCommentUseCase(
  commentRepo,
  postRepo,
  userRepo,
  investorRepo,
  storageService,
  createNotificationUseCase
);
const getCommentsUseCase = new GetCommentsUseCase(commentRepo, storageService);
const likeCommentUseCase = new LikeCommentUseCase(commentRepo);

export const commentController = new CommentController(
  createCommentUseCase,
  getCommentsUseCase,
  likeCommentUseCase
);

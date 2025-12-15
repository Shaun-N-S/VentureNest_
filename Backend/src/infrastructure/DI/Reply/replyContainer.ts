import { commentModel } from "@infrastructure/db/models/commentModel";
import { investorModel } from "@infrastructure/db/models/investorModel";
import { replyModel } from "@infrastructure/db/models/replyModel";
import { userModel } from "@infrastructure/db/models/userModel";
import { CommentRepository } from "@infrastructure/repostiories/commentRepository";
import { InvestorRepository } from "@infrastructure/repostiories/investorRepository";
import { ReplyRepository } from "@infrastructure/repostiories/replyRepository";
import { UserRepository } from "@infrastructure/repostiories/userRepository";
import { StorageService } from "@infrastructure/services/storageService";
import { CreateReplyUseCase } from "application/useCases/Reply/createReplyUseCase";
import { GetReplyUseCase } from "application/useCases/Reply/getReplyUseCase";
import { LikeReplyUseCase } from "application/useCases/Reply/likeReplyUseCase";
import { ReplyController } from "interfaceAdapters/controller/Reply/replyController";

const replyRepo = new ReplyRepository(replyModel);
const userRepo = new UserRepository(userModel);
const investorRepo = new InvestorRepository(investorModel);
const storageService = new StorageService();
const commentRepo = new CommentRepository(commentModel);

const createReplyUseCase = new CreateReplyUseCase(
  replyRepo,
  userRepo,
  investorRepo,
  commentRepo,
  storageService
);
const getRepliesUseCase = new GetReplyUseCase(replyRepo, storageService);
const likeReplyUseCase = new LikeReplyUseCase(replyRepo);

export const replyController = new ReplyController(
  createReplyUseCase,
  getRepliesUseCase,
  likeReplyUseCase
);

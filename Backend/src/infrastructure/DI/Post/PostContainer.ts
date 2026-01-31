import { investorModel } from "@infrastructure/db/models/investorModel";
import { postModel } from "@infrastructure/db/models/postModel";
import { userModel } from "@infrastructure/db/models/userModel";
import { SocketEngagementPublisher } from "@infrastructure/realtime/Publishers/socketEngagementEventPublisher";
import { InvestorRepository } from "@infrastructure/repostiories/investorRepository";
import { PostRepository } from "@infrastructure/repostiories/postRepository";
import { UserRepository } from "@infrastructure/repostiories/userRepository";
import { StorageService } from "@infrastructure/services/storageService";
import { CreatePostUseCase } from "application/useCases/Post/createPostUseCase";
import { FetchAllPostsUseCase } from "application/useCases/Post/fetchAllPostsUseCase";
import { FetchPersonalPostUseCase } from "application/useCases/Post/fetchPersonalPostUseCase";
import { FetchPostLikesUseCase } from "application/useCases/Post/fetchPostLikesUseCase";
import { LikePostUseCase } from "application/useCases/Post/likePostUseCase";
import { RemovePostUseCase } from "application/useCases/Post/removePostUseCase";
import { PostController } from "interfaceAdapters/controller/Post/postController";

const postRespository = new PostRepository(postModel);
const userRepository = new UserRepository(userModel);
const investorRepository = new InvestorRepository(investorModel);
const storageService = new StorageService();
const engagementPublisher = new SocketEngagementPublisher();

const createPostUseCase = new CreatePostUseCase(postRespository, storageService);
const fetchPersonalPostUseCase = new FetchPersonalPostUseCase(postRespository, storageService);
const fetchAllPostsUseCase = new FetchAllPostsUseCase(
  postRespository,
  userRepository,
  investorRepository,
  storageService
);
const removePostUseCase = new RemovePostUseCase(postRespository, storageService);
const likePostUseCase = new LikePostUseCase(postRespository, engagementPublisher);
const fetchPostLikesUseCase = new FetchPostLikesUseCase(
  postRespository,
  userRepository,
  investorRepository,
  storageService
);

export const postController = new PostController(
  createPostUseCase,
  fetchPersonalPostUseCase,
  fetchAllPostsUseCase,
  removePostUseCase,
  likePostUseCase,
  fetchPostLikesUseCase
);

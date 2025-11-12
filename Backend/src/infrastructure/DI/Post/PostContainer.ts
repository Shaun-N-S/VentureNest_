import { postModel } from "@infrastructure/db/models/postModel";
import { PostRepository } from "@infrastructure/repostiories/postRepository";
import { StorageService } from "@infrastructure/services/storageService";
import { CreatePostUseCase } from "application/useCases/Post/createPostUseCase";
import { PostController } from "interfaceAdapters/controller/Post/postController";

const postRespository = new PostRepository(postModel);
const storageService = new StorageService();

const createPostUseCase = new CreatePostUseCase(postRespository, storageService);

export const postController = new PostController(createPostUseCase);

import type { Socket } from "socket.io-client";
import { queryClient } from "../main";
import type {
  PostLikeUpdatedEvent,
  PostCommentUpdatedEvent,
} from "../types/socketEvents";
import type { AllPost, PostsPage } from "../types/postFeed";

export const registerFeedSocket = (socket: Socket) => {
  socket.on(
    "post:like-updated",
    ({ postId, likeCount }: PostLikeUpdatedEvent) => {
      queryClient.setQueryData<PostsPage>(["posts-feed"], (old) => {
        if (!old) return old;

        return {
          ...old,
          posts: old.posts.map((post: AllPost) =>
            post._id === postId ? { ...post, likeCount } : post,
          ),
        };
      });
    },
  );

  socket.on(
    "post:comment-updated",
    ({ postId, commentCount }: PostCommentUpdatedEvent) => {
      queryClient.setQueryData<PostsPage>(["posts-feed"], (old) => {
        if (!old) return old;

        return {
          ...old,
          posts: old.posts.map((post: AllPost) =>
            post._id === postId
              ? { ...post, commentsCount: commentCount }
              : post,
          ),
        };
      });
    },
  );
};

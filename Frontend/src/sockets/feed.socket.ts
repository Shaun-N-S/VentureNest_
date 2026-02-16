import type { Socket } from "socket.io-client";
import { queryClient } from "../main";
import type { InfiniteData } from "@tanstack/react-query";
import type { PostsPage } from "../types/postFeed";
import { store } from "../store/store";

export const registerFeedSocket = (socket: Socket) => {
  socket.on("post:like-updated", ({ postId, likeCount, actorId, liked }) => {
    const currentUserId = store.getState().authData.id;

    queryClient.setQueryData<InfiniteData<PostsPage>>(
      ["posts-feed"],
      (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            posts: page.posts.map((post) =>
              post._id === postId
                ? {
                    ...post,
                    likeCount,
                    liked: actorId === currentUserId ? liked : post.liked,
                  }
                : post,
            ),
          })),
        };
      },
    );
  });

  socket.on("post:comment-updated", ({ postId, commentCount }) => {
    queryClient.setQueryData<InfiniteData<PostsPage>>(
      ["posts-feed"],
      (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            posts: page.posts.map((post) =>
              post._id === postId
                ? { ...post, commentsCount: commentCount }
                : post,
            ),
          })),
        };
      },
    );
  });
};

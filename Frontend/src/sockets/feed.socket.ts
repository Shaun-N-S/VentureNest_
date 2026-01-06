import { getSocket } from "../lib/socket";
import { queryClient } from "../main";

let registered = false;

export const registerFeedSocket = () => {
  if (registered) return;
  registered = true;

  const socket = getSocket();
  if (!socket) return;

  socket.on("post:like-updated", ({ postId, likeCount }) => {
    queryClient.setQueriesData(
      {
        predicate: (query) =>
          Array.isArray(query.queryKey) && query.queryKey[0] === "posts-feed",
      },
      (old: any) => {
        if (!old?.posts) return old;

        return {
          ...old,
          posts: old.posts.map((post: any) =>
            post._id === postId ? { ...post, likeCount } : post
          ),
        };
      }
    );
  });

  socket.on("post:comment-updated", ({ postId, commentCount }) => {
    queryClient.setQueriesData(
      {
        predicate: (query) =>
          Array.isArray(query.queryKey) && query.queryKey[0] === "posts-feed",
      },
      (old: any) => {
        if (!old?.posts) return old;

        return {
          ...old,
          posts: old.posts.map((post: any) =>
            post._id === postId
              ? { ...post, commentsCount: commentCount }
              : post
          ),
        };
      }
    );
  });
};

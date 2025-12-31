import { useSelector } from "react-redux";
import type { Rootstate } from "../../store/store";
import { useEffect } from "react";
import { getSocket } from "../../lib/socket";
import type { PostLikeToggledEvent } from "../../types/postLikeToggledEvent";
import { queryClient } from "../../main";
import type { FetchPostsResponse } from "../../types/postFeed";

export const useFeedSocket = () => {
  const currentUserId = useSelector((state: Rootstate) => state.authData.id);

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !currentUserId) return;

    const onLikeToggled = ({
      postId,
      likeCount,
      likerId,
    }: PostLikeToggledEvent) => {
      if (likerId === currentUserId) return;

      queryClient.setQueriesData(
        { queryKey: ["posts-feed"], exact: false },
        (old: FetchPostsResponse | undefined) => {
          if (!old?.data?.posts) return old;

          return {
            ...old,
            data: {
              ...old.data,
              posts: old.data.posts.map((post) =>
                post._id === postId ? { ...post, likeCount } : post
              ),
            },
          };
        }
      );
    };

    socket.on("post:likeToggled", onLikeToggled);

    return () => {
      socket.off("post:likeToggled", onLikeToggled);
    };
  }, [currentUserId]);
};

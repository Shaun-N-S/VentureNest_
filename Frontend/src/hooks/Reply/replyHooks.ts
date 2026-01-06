import {
  useInfiniteQuery,
  useMutation,
  type InfiniteData,
} from "@tanstack/react-query";
import {
  addReply,
  getAllReplies,
  likeReply,
  type GetRepliesResponse,
} from "../../services/Reply/ReplyService";
import { queryClient } from "../../main";

export const useAddReply = () => {
  return useMutation({
    mutationFn: ({
      commentId,
      replyText,
    }: {
      commentId: string;
      replyText: string;
    }) => addReply(commentId, replyText),

    onSuccess: (res, variables) => {
      queryClient.setQueryData<InfiniteData<GetRepliesResponse>>(
        ["replies", variables.commentId],
        (old) => {
          if (!old) return old;

          return {
            ...old,
            pages: [
              {
                ...old.pages[0],
                replies: [res.data, ...old.pages[0].replies],
              },
              ...old.pages.slice(1),
            ],
          };
        }
      );
    },
  });
};

export const useInfiniteReplies = (
  commentId: string,
  limit = 10,
  enabled = true
) => {
  return useInfiniteQuery<GetRepliesResponse, Error>({
    queryKey: ["replies", commentId],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      getAllReplies(commentId, pageParam as number, limit),
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined,
    enabled: enabled && !!commentId,
    staleTime: 60 * 1000,
  });
};

export const useLikeReply = () => {
  return useMutation({
    mutationFn: (replyId: string) => likeReply(replyId),

    onSuccess: (res, replyId) => {
      queryClient.setQueriesData<InfiniteData<GetRepliesResponse>>(
        { queryKey: ["replies"] },
        (old) => {
          if (!old) return old;

          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              replies: page.replies.map((r) =>
                r._id === replyId
                  ? { ...r, liked: res.data.liked, likes: res.data.likeCount }
                  : r
              ),
            })),
          };
        }
      );
    },
  });
};

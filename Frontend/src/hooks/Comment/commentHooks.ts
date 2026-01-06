import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import {
  addComment,
  getAllComments,
  likeComment,
} from "../../services/Comment/CommentService";
import type { CommentResponse } from "../../types/commentApiResponse";

export const useAddComment = () => {
  return useMutation({
    mutationFn: async ({
      postId,
      commentText,
    }: {
      postId: string;
      commentText: string;
    }) => {
      return addComment(postId, commentText);
    },
  });
};

export const useInfiniteComments = (
  postId: string,
  limit = 10,
  enabled = true
) => {
  return useInfiniteQuery<CommentResponse>({
    queryKey: ["comments", postId],

    initialPageParam: 1,

    queryFn: ({ pageParam }) =>
      getAllComments(postId, pageParam as number, limit),

    getNextPageParam: (lastPage) =>
      lastPage.data.hasNextPage ? lastPage.data.currentPage + 1 : undefined,

    enabled,
    staleTime: 1000 * 60,
  });
};

export const useLikeComment = () => {
  return useMutation({
    mutationFn: (commentId: string) => likeComment(commentId),
  });
};

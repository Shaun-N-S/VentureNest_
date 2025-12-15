import { useMutation, useQuery } from "@tanstack/react-query";
import {
  addComment,
  getAllComments,
  likeComment,
} from "../../services/Comment/CommentService";
import type { CommentApiResponse, CommentResponse } from "../../types/commentApiResponse";

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

export const useGetAllComments = (
  postId: string,
  page: number,
  limit: number,
  config?: { enabled?: boolean }
) => {
  return useQuery<CommentResponse>({
    queryKey: ["comments", postId, page],
    queryFn: () => getAllComments(postId, page, limit),
    enabled: config?.enabled ?? true,
  });
};

export const useLikeComment = () => {
  return useMutation({
    mutationFn: (commentId: string) => likeComment(commentId),
  });
};

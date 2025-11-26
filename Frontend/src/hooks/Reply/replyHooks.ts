import { useMutation, useQuery } from "@tanstack/react-query";
import { addReply, getAllReplies } from "../../services/Reply/ReplyService";

export const useAddReply = () => {
  return useMutation({
    mutationFn: ({
      commentId,
      replyText,
    }: {
      commentId: string;
      replyText: string;
    }) => addReply(commentId, replyText),
  });
};

export const useGetAllReplies = (
  commentId: string,
  page: number,
  limit: number,
  config?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ["replies", commentId, page, limit],
    queryFn: () => getAllReplies(commentId, page, limit),
    enabled: config?.enabled ?? Boolean(commentId),
    staleTime: 1000 * 60 * 1,
  });
};

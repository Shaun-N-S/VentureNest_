import z from "zod";

export const CommentSchema = z.object({
  commentText: z.string().trim().min(1, "Comment required").max(500, "Comment too long"),
});

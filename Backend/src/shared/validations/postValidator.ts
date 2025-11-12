import { z } from "zod";
import { UserRole } from "@domain/enum/userRole";

export const createPostSchema = z.object({
  authorId: z.string().min(1, "Author ID is required"),

  authorRole: z.nativeEnum(UserRole, {
    message: "Invalid author role",
  }),

  content: z.string().trim(),
  mediaUrls: z.array(z.file()),
});

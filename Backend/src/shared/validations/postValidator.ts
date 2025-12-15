import { z } from "zod";
import { UserRole } from "@domain/enum/userRole";

export const createPostSchema = z
  .object({
    authorId: z.string().min(1, "Author ID is required"),
    authorRole: z.nativeEnum(UserRole),
    content: z.string().trim().optional(),

    mediaUrls: z
      .array(
        z.custom<File>(
          (val) => {
            return typeof File !== "undefined" && val instanceof File;
          },
          {
            message: "Invalid file format",
          }
        )
      )
      .optional(),
  })
  .strip();

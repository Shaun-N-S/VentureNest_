import z from "zod";

export const userProfileUpdateSchema = z.object({
  id: z.string().min(1, "User ID is required"),
  profileImg: z.instanceof(File).optional(),
  formData: z.object({
    userName: z.string().trim().optional(),
    bio: z.string().trim().optional(),
    website: z.string().url("Invalid website URL").optional(),
    linkedInUrl: z.string().url("Invalid LinkedIn URL").optional(),
  }),
});

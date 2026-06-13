import z from "zod";

export const userProfileUpdateSchema = z.object({
  id: z.string().min(1, "User ID is required"),

  profileImg: z.any().optional(),

  formData: z
    .object({
      userName: z
        .string()
        .trim()
        .min(3, "Username must be at least 3 characters")
        .max(30, "Username cannot exceed 30 characters")
        .optional(),
      bio: z.string().trim().max(500, "Bio cannot exceed 500 characters").optional(),
      website: z.string().url("Invalid website URL").optional(),
      linkedInUrl: z.string().url("Invalid LinkedIn URL").optional(),
    })
    .optional(),
});

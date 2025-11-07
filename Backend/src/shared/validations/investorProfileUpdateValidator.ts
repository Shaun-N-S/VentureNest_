import { z } from "zod";

export const investorProfileUpdateSchema = z.object({
  id: z.string().min(1, "Investor ID is required"),

  // profileImg: z
  //   .any()
  //   .optional()
  //   .refine(
  //     (file) => !file || (file && typeof file === "object" && "originalname" in file),
  //     "Invalid file format for profile image"
  //   ),

  formData: z.object({
    userName: z.string().trim().optional(),
    bio: z.string().trim().optional(),
    website: z.string().url("Invalid website URL format").optional().or(z.literal("")),
    companyName: z.string().optional(),
    experience: z
      .number()
      .int("Experience must be a whole number")
      .nonnegative("Experience cannot be negative")
      .optional(),
    location: z.string().optional(),
    investmentMin: z.number().nonnegative("Minimum investment must be positive").optional(),
    investmentMax: z.number().nonnegative("Maximum investment must be positive").optional(),
  }),
});

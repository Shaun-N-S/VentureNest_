import { z } from "zod";

const toNumber = (val: unknown) => {
  if (val === "" || val === undefined || val === null) return undefined;
  const num = Number(val);
  return isNaN(num) ? val : num;
};

export const investorProfileUpdateSchema = z.object({
  id: z.string().min(1, "Investor ID is required"),

  profileImg: z.file().optional(),

  formData: z.object({
    userName: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username cannot exceed 30 characters")
      .optional(),
    bio: z.string().trim().max(500, "Bio cannot exceed 500 characters").optional(),
    website: z.string().url("Invalid website URL format").optional().or(z.literal("")),
    companyName: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z.string().trim().min(2).max(100).optional()
    ),

    experience: z.preprocess(toNumber, z.number().int().nonnegative().optional()),

    location: z.string().trim().max(100).optional(),

    investmentMin: z.preprocess(toNumber, z.number().nonnegative().optional()),

    investmentMax: z.preprocess(toNumber, z.number().nonnegative().optional()),
  }),
});

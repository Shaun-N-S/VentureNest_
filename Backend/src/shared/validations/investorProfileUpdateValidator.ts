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
    userName: z.string().trim().optional(),
    bio: z.string().trim().optional(),
    website: z.string().url("Invalid website URL format").optional().or(z.literal("")),

    companyName: z.string().optional(),

    experience: z.preprocess(toNumber, z.number().int().nonnegative().optional()),

    location: z.string().optional(),

    investmentMin: z.preprocess(toNumber, z.number().nonnegative().optional()),

    investmentMax: z.preprocess(toNumber, z.number().nonnegative().optional()),
  }),
});

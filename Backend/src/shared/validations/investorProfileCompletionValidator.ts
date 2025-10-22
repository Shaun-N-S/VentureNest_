import { z } from "zod";

export const InvestorProfileSchema = z
  .object({
    location: z.string().min(1, "Location is required"),
    companyName: z.string().min(1, "Company name is required"),
    experience: z.number("Experience must be a number").min(0, "Experience cannot be negative"),
    preferredSector: z.array(z.string()).nonempty("At least one preferred sector is required"),
    preferredStartupStage: z
      .array(z.string())
      .nonempty("At least one preferred startup stage is required"),
    investmentMin: z.number("Investment minimum must be a number"),
    investmentMax: z.number("Investment maximum must be a number"),
  })
  .refine((data) => data.investmentMin <= data.investmentMax, {
    message: "Investment minimum cannot be greater than maximum",
    path: ["investmentMin"], // highlight which field caused the issue
  });

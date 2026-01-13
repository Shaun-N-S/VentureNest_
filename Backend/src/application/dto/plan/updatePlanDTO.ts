import { ProfileBoost } from "@domain/enum/profileBoost";

export interface UpdatePlanDTO {
  name?: string | undefined;
  description?: string | undefined;

  limits?:
    | {
        messages?: number | undefined;
        consentLetters?: number | undefined;
        profileBoost?: ProfileBoost | undefined;
      }
    | undefined;

  billing?:
    | {
        durationDays?: number | undefined;
        price?: number | undefined;
      }
    | undefined;
}

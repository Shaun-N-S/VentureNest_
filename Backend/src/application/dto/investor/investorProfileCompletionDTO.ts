import { PreferredSector } from "@domain/enum/preferredSector";
import { StartupStage } from "@domain/enum/startupStages";

export interface InvestorProfileCompletionReqDTO {
  id: string;
  profileImg?: File;
  portfolioPdf?: File;
  formData: profileCompletion;
}

export interface profileCompletion {
  linkedInUrl: string;
  companyName: string;
  experience: number;
  location: string;
  preferredSector: PreferredSector[];
  preferredStartupStage: StartupStage[];
  investmentMin: number;
  investmentMax: number;
}

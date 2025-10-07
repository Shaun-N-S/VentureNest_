import { PreferredSector } from "@domain/enum/preferredSector";
import { UserEntity } from "../user/userEntity";
import { StartupStage } from "@domain/enum/startupStages";

export interface InvestorEntity extends UserEntity {
  location: string;
  companyName: string;
  experience: number;
  preferredSector: PreferredSector[];
  preferredStartupStage: StartupStage[];
  investmentMin: number;
  investmentMax: number;
  portfolioPdf: string;
}

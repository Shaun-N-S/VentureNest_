import { PreferredSector } from "@domain/enum/preferredSector";
import { StartupStage } from "@domain/enum/startupStages";
import { TeamSize } from "@domain/enum/teamSize";

export interface ProjectEntity {
  _id?: string;
  user_id: string;
  startup_name: string;
  short_description: string;
  pitch_deck_url: string;
  project_website: string;
  user_role: string;
  team_size: TeamSize;
  category: PreferredSector;
  stage: StartupStage;
  logo_url: string;
  cover_image_url: string;
  location: string;
  likes: string[];
  like_count: number;
  is_active: boolean;
  wallet_id?: string;
  donation_enabled: boolean;
  donation_target: number;
  donation_received: number;
  project_register: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

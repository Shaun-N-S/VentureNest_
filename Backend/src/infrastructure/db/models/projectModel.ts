import { Document, model, Types } from "mongoose";
import projectSchema from "../schema/projectSchema";
import { PreferredSector } from "@domain/enum/preferredSector";
import { StartupStage } from "@domain/enum/startupStages";
import { TeamSize } from "@domain/enum/teamSize";

export interface IProjectModel extends Document {
  user_id: Types.ObjectId;
  startup_name: string;
  short_description: string;
  pitch_deck_url?: string;
  project_website?: string;
  user_role: string;
  team_size: TeamSize;
  category: PreferredSector;
  stage: StartupStage;
  logo_url?: string;
  cover_image_url?: string;
  location?: string;
  likes: Types.ObjectId[];
  like_count: number;
  is_active: boolean;
  wallet_id?: Types.ObjectId;
  donation_enabled: boolean;
  donation_target: number;
  donation_received: number;
  project_register: boolean;
}

export const projectModel = model<IProjectModel>("Project", projectSchema);

import { ProjectEntity } from "@domain/entities/project/projectEntity";
import { ProjectResDTO, CreateProjectDTO } from "application/dto/project/projectDTO";

export class ProjectMapper {
  // Entity → DTO (for responses)
  static toDTO(entity: ProjectEntity): ProjectResDTO {
    if (!entity._id) throw new Error("Project _id is required for DTO");
    if (!entity.createdAt || !entity.updatedAt) {
      throw new Error("Timestamps are required");
    }

    return {
      _id: entity._id!,
      user_id: entity.user_id,
      startup_name: entity.startup_name,
      short_description: entity.short_description,
      pitch_deck_url: entity.pitch_deck_url,
      project_website: entity.project_website,
      user_role: entity.user_role,
      team_size: entity.team_size,
      category: entity.category,
      stage: entity.stage,
      logo_url: entity.logo_url,
      cover_image_url: entity.cover_image_url,
      location: entity.location,
      likes: entity.likes ?? [],
      like_count: entity.like_count ?? 0,
      is_active: entity.is_active ?? true,
      donation_enabled: entity.donation_enabled ?? false,
      donation_target: entity.donation_target ?? 0,
      donation_received: entity.donation_received ?? 0,
      project_register: entity.project_register ?? false,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      // Conditionally include wallet_id only if defined (omits if undefined for exactOptionalPropertyTypes)
      ...(entity.wallet_id !== undefined && { wallet_id: entity.wallet_id }),
    };
  }

  // DTO → Entity (for reading/updating)
  static toEntity(dto: ProjectResDTO): ProjectEntity {
    return {
      _id: dto._id,
      user_id: dto.user_id,
      startup_name: dto.startup_name,
      short_description: dto.short_description,
      pitch_deck_url: dto.pitch_deck_url ?? "",
      project_website: dto.project_website ?? "",
      user_role: dto.user_role,
      team_size: dto.team_size,
      category: dto.category,
      stage: dto.stage,
      logo_url: dto.logo_url ?? "",
      cover_image_url: dto.cover_image_url ?? "",
      location: dto.location ?? "",
      likes: dto.likes ?? [],
      like_count: dto.like_count ?? 0,
      is_active: dto.is_active ?? true,
      donation_enabled: dto.donation_enabled ?? false,
      donation_target: dto.donation_target ?? 0,
      donation_received: dto.donation_received ?? 0,
      project_register: dto.project_register ?? false,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
      // Conditionally include wallet_id only if defined (omits if undefined for exactOptionalPropertyTypes)
      ...(dto.wallet_id !== undefined && { wallet_id: dto.wallet_id }),
    };
  }

  // Create DTO → Entity (for new records)
  static createToEntity(dto: CreateProjectDTO): ProjectEntity {
    const now = new Date();
    return {
      user_id: dto.user_id,
      startup_name: dto.startup_name,
      short_description: dto.short_description,
      pitch_deck_url: dto.pitch_deck_url ?? "",
      project_website: dto.project_website ?? "",
      user_role: dto.user_role,
      team_size: dto.team_size,
      category: dto.category,
      stage: dto.stage,
      logo_url: dto.logo_url ?? "",
      cover_image_url: dto.cover_image_url ?? "",
      location: dto.location ?? "",
      likes: [],
      like_count: 0,
      is_active: true,
      donation_enabled: dto.donation_enabled ?? false,
      donation_target: dto.donation_target ?? 0,
      donation_received: 0,
      project_register: dto.project_register ?? false,
      createdAt: now,
      updatedAt: now,
    };
  }
}

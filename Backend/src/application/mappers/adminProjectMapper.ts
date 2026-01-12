import { AdminProjectResDTO } from "application/dto/project/projectDTO";
import { PopulatedProjectRepoDTO } from "application/dto/project/projectDTO";

export class AdminProjectMapper {
  static toDTO(project: PopulatedProjectRepoDTO): AdminProjectResDTO {
    return {
      id: project._id,
      startupName: project.startupName,
      shortDescription: project.shortDescription,
      stage: project.stage,
      category: project.category,
      isActive: project.isActive,
      createdAt: project.createdAt,

      logoUrl: project.logoUrl ?? null,
      coverImageUrl: project.coverImageUrl ?? null,

      owner: {
        id: project.userId,
        name: project.populatedUser?.userName ?? "Unknown",
        profileImg: project.populatedUser?.profileImg ?? null,
      },
    };
  }
}

import { AdminDashboardInsightsDTO } from "application/dto/admin/adminDashboardInsightsDTO";
import { TopCategoryRaw, TopStageRaw } from "application/type/adminInsightsTypes";

export class AdminDashboardInsightsMapper {
  static toDTO(categories: TopCategoryRaw[], stages: TopStageRaw[]): AdminDashboardInsightsDTO {
    return {
      categoryDistribution: categories.map((c) => ({
        name: c.category,
        value: c.totalFunding,
      })),

      stageDistribution: stages.map((s) => ({
        name: s.stage,
        value: s.totalFunding,
      })),
    };
  }
}

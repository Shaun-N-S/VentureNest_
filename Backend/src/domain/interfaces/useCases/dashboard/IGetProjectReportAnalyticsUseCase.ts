import {
  GetProjectReportAnalyticsRequestDTO,
  ProjectReportAnalyticsResponseDTO,
} from "application/dto/dashboard/projectReportAnalyticsDTO";

export interface IGetProjectReportAnalyticsUseCase {
  execute(dto: GetProjectReportAnalyticsRequestDTO): Promise<ProjectReportAnalyticsResponseDTO>;
}

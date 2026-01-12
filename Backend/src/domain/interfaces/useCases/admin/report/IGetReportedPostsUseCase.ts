import { AdminReportedPostDTO } from "application/dto/report/adminReportDTO";

export interface IGetReportedPostsUseCase {
  execute(): Promise<AdminReportedPostDTO[]>;
}

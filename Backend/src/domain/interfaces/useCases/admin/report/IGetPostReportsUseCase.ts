import { AdminPostReportDetailDTO } from "application/dto/report/adminReportDTO";

export interface IGetPostReportsUseCase {
  execute(postId: string): Promise<AdminPostReportDetailDTO[]>;
}

import { IReportRepository } from "@domain/interfaces/repositories/IReportRepository";
import { IGetReportedPostsUseCase } from "@domain/interfaces/useCases/admin/report/IGetReportedPostsUseCase";
import { AdminReportedPostDTO } from "application/dto/report/adminReportDTO";

export class GetReportedPostsUseCase implements IGetReportedPostsUseCase {
  constructor(private _reportRepository: IReportRepository) {}

  async execute(): Promise<AdminReportedPostDTO[]> {
    return this._reportRepository.getReportedPosts();
  }
}

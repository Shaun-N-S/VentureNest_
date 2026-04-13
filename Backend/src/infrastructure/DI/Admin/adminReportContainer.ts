import { investorModel } from "@infrastructure/db/models/investorModel";
import { postModel } from "@infrastructure/db/models/postModel";
import { reportModel } from "@infrastructure/db/models/reportModel";
import { userModel } from "@infrastructure/db/models/userModel";
import { InvestorRepository } from "@infrastructure/repostiories/investorRepository";
import { PostRepository } from "@infrastructure/repostiories/postRepository";
import { ReportRepository } from "@infrastructure/repostiories/reportRepository";
import { UserRepository } from "@infrastructure/repostiories/userRepository";
import { StorageService } from "@infrastructure/services/storageService";
import { AdminRemovePostUseCase } from "application/useCases/Admin/post/adminRemovePostUseCase";
import { GetPostReportsUseCase } from "application/useCases/Admin/report/getPostReportsUseCase";
import { GetProjectReportsUseCase } from "application/useCases/Admin/report/getProjectReportsUseCase";
import { GetReportedPostsUseCase } from "application/useCases/Admin/report/getReportedPostsUseCase";
import { GetReportedProjectsUseCase } from "application/useCases/Admin/report/getReportedProjectsUseCase";
import { UpdateReportStatusUseCase } from "application/useCases/Admin/report/updateReportStatusUseCase";
import { AdminReportController } from "interfaceAdapters/controller/Admin/adminReportController";

//service and repository
const reportRepository = new ReportRepository(reportModel);
const userRepository = new UserRepository(userModel);
const investorRepository = new InvestorRepository(investorModel);
const postRepository = new PostRepository(postModel);
const storageService = new StorageService();

//usecase
const getReportedPostsUseCase = new GetReportedPostsUseCase(reportRepository);
const getReportedProjectsUseCase = new GetReportedProjectsUseCase(reportRepository);
const getPostReportsUseCase = new GetPostReportsUseCase(
  reportRepository,
  userRepository,
  investorRepository,
  storageService
);
const getProjectReportsUseCase = new GetProjectReportsUseCase(
  reportRepository,
  userRepository,
  investorRepository,
  storageService
);
const updateReportStatusUseCase = new UpdateReportStatusUseCase(reportRepository);
const removePostUseCase = new AdminRemovePostUseCase(postRepository, storageService);

//controller
export const adminReportController = new AdminReportController(
  getReportedPostsUseCase,
  getReportedProjectsUseCase,
  getPostReportsUseCase,
  getProjectReportsUseCase,
  updateReportStatusUseCase,
  removePostUseCase
);

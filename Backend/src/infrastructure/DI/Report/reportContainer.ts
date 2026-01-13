import { reportModel } from "@infrastructure/db/models/reportModel";
import { ReportRepository } from "@infrastructure/repostiories/reportRepository";
import { CreateReportUseCase } from "application/useCases/Report/createReportUseCase";
import { ReportController } from "interfaceAdapters/controller/Report/reportController";

const reportRepository = new ReportRepository(reportModel);

//usecase
const createReportUseCase = new CreateReportUseCase(reportRepository);

//controller
export const reportController = new ReportController(createReportUseCase);

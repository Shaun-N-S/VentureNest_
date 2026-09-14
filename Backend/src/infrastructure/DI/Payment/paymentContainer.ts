import { PaymentModel } from "@infrastructure/db/models/paymentModel";
import { dealModel } from "@infrastructure/db/models/dealModel";
import { projectModel } from "@infrastructure/db/models/projectModel";
import { PaymentRepository } from "@infrastructure/repostiories/paymentRepository";
import { DealRepository } from "@infrastructure/repostiories/dealRepository";
import { ProjectRepository } from "@infrastructure/repostiories/projectRepository";
import { GetPaymentSessionSummaryUseCase } from "application/useCases/Payment/getPaymentSessionSummaryUseCase";
import { PaymentController } from "interfaceAdapters/controller/Payment/paymentController";

const paymentRepo = new PaymentRepository(PaymentModel);
const dealRepo = new DealRepository(dealModel);
const projectRepo = new ProjectRepository(projectModel);

const getPaymentSessionSummaryUseCase = new GetPaymentSessionSummaryUseCase(
  paymentRepo,
  dealRepo,
  projectRepo
);

export const paymentController = new PaymentController(getPaymentSessionSummaryUseCase);

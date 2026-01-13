import { planModel } from "@infrastructure/db/models/planModel";
import { PlanRepository } from "@infrastructure/repostiories/planRepository";
import { CreatePlanUseCase } from "application/useCases/Admin/plan/createPlanUseCase";
import { AdminPlanController } from "interfaceAdapters/controller/Admin/adminPlanController";

const planRepository = new PlanRepository(planModel);
const createPlanUseCase = new CreatePlanUseCase(planRepository);

export const adminPlanController = new AdminPlanController(createPlanUseCase);

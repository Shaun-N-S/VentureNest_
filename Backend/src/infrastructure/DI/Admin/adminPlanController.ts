import { planModel } from "@infrastructure/db/models/planModel";
import { PlanRepository } from "@infrastructure/repostiories/planRepository";
import { CreatePlanUseCase } from "application/useCases/Admin/plan/createPlanUseCase";
import { GetAllPlansUseCase } from "application/useCases/Admin/plan/getAllPlansUseCase";
import { GetPlanByIdUseCase } from "application/useCases/Admin/plan/getPlanByIdUseCase";
import { UpdatePlanStatusUseCase } from "application/useCases/Admin/plan/updatePlanStatusUseCase";
import { UpdatePlanUseCase } from "application/useCases/Admin/plan/updatePlanUseCase";
import { AdminPlanController } from "interfaceAdapters/controller/Admin/adminPlanController";

const planRepository = new PlanRepository(planModel);

const createPlanUseCase = new CreatePlanUseCase(planRepository);
const getAllPlansUseCase = new GetAllPlansUseCase(planRepository);
const getPlanByIdUseCase = new GetPlanByIdUseCase(planRepository);
const updatedPlanUseCase = new UpdatePlanUseCase(planRepository);
const updatePlanStatusUseCase = new UpdatePlanStatusUseCase(planRepository);

export const adminPlanController = new AdminPlanController(
  createPlanUseCase,
  getAllPlansUseCase,
  getPlanByIdUseCase,
  updatedPlanUseCase,
  updatePlanStatusUseCase
);

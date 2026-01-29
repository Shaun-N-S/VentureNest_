import { planModel } from "@infrastructure/db/models/planModel";
import { PlanRepository } from "@infrastructure/repostiories/planRepository";
import { GetAvailablePlansUseCase } from "application/useCases/Plan/getAvialablePlans";
import { PlanController } from "interfaceAdapters/controller/Plan/planController";

const planRepository = new PlanRepository(planModel);

const getAvailablePlansUseCase = new GetAvailablePlansUseCase(planRepository);

export const planController = new PlanController(getAvailablePlansUseCase);

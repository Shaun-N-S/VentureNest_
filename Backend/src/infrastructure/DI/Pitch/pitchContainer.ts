import { pitchModel } from "@infrastructure/db/models/pitchModel";
import { projectModel } from "@infrastructure/db/models/projectModel";
import { PitchRepository } from "@infrastructure/repostiories/pitchRepository";
import { ProjectRepository } from "@infrastructure/repostiories/projectRepository";
import { CreatePitchUseCase } from "application/useCases/Pitch/createPitchUseCase";
import { PitchController } from "interfaceAdapters/controller/Pitch/pitchController";

const pitchRepo = new PitchRepository(pitchModel);
const projectRepo = new ProjectRepository(projectModel);

const createPitchUseCase = new CreatePitchUseCase(pitchRepo, projectRepo);

export const pitchController = new PitchController(createPitchUseCase);

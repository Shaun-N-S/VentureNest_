import { pitchModel } from "@infrastructure/db/models/pitchModel";
import { projectModel } from "@infrastructure/db/models/projectModel";
import { PitchRepository } from "@infrastructure/repostiories/pitchRepository";
import { ProjectRepository } from "@infrastructure/repostiories/projectRepository";
import { StorageService } from "@infrastructure/services/storageService";
import { CreatePitchUseCase } from "application/useCases/Pitch/createPitchUseCase";
import { GetPitchDetailsUseCase } from "application/useCases/Pitch/getPitchDetailsUseCase";
import { GetReceivedPitchesUseCase } from "application/useCases/Pitch/getReceivedPitchesUseCase";
import { GetSentPitchesUseCase } from "application/useCases/Pitch/getSentPitchesUseCase";
import { RespondToPitchUseCase } from "application/useCases/Pitch/RespondToPitchUseCase";
import { PitchController } from "interfaceAdapters/controller/Pitch/pitchController";

const pitchRepo = new PitchRepository(pitchModel);
const projectRepo = new ProjectRepository(projectModel);
const storageService = new StorageService();

const createPitchUseCase = new CreatePitchUseCase(pitchRepo, projectRepo);
const getReceivedPitchesUseCase = new GetReceivedPitchesUseCase(pitchRepo, storageService);
const getSentPitchesUseCase = new GetSentPitchesUseCase(pitchRepo, storageService);
const getPitchDetailsUseCase = new GetPitchDetailsUseCase(pitchRepo, storageService);
const respondToPitchUseCase = new RespondToPitchUseCase(pitchRepo);

export const pitchController = new PitchController(
  createPitchUseCase,
  getReceivedPitchesUseCase,
  getSentPitchesUseCase,
  getPitchDetailsUseCase,
  respondToPitchUseCase
);

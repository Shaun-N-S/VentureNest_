import { projectModel } from "@infrastructure/db/models/projectModel";
import { sessionModel } from "@infrastructure/db/models/sessionModel";
import { ticketModel } from "@infrastructure/db/models/ticketModel";

import { ProjectRepository } from "@infrastructure/repostiories/projectRepository";
import { SessionRepository } from "@infrastructure/repostiories/sessionRepository";
import { TicketRepository } from "@infrastructure/repostiories/ticketRepository";
import { StorageService } from "@infrastructure/services/storageService";

import { CreateTicketWithSessionUseCase } from "application/useCases/Ticket/createTicketWithSessionUseCase";
import { GetTicketsByInvestorUseCase } from "application/useCases/Ticket/getTicketsByInvestorUseCase";
import { TicketController } from "interfaceAdapters/controller/Ticket/ticketController";

// repositories
const ticketRepo = new TicketRepository(ticketModel);
const sessionRepo = new SessionRepository(sessionModel);
const projectRepo = new ProjectRepository(projectModel);
const storageService = new StorageService();

// use case
const createTicketWithSessionUseCase = new CreateTicketWithSessionUseCase(
  ticketRepo,
  sessionRepo,
  projectRepo
);
const getTicketsByInvestorUseCase = new GetTicketsByInvestorUseCase(ticketRepo, storageService);

// controller
export const ticketController = new TicketController(
  createTicketWithSessionUseCase,
  getTicketsByInvestorUseCase
);

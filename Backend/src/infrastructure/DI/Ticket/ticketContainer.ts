import { projectModel } from "@infrastructure/db/models/projectModel";
import { sessionModel } from "@infrastructure/db/models/sessionModel";
import { ticketModel } from "@infrastructure/db/models/ticketModel";
import { userModel } from "@infrastructure/db/models/userModel";

import { ProjectRepository } from "@infrastructure/repostiories/projectRepository";
import { SessionRepository } from "@infrastructure/repostiories/sessionRepository";
import { TicketRepository } from "@infrastructure/repostiories/ticketRepository";
import { UserRepository } from "@infrastructure/repostiories/userRepository";
import { SessionCreatedEmailContentGenerator } from "@infrastructure/services/Email/EmailContentGenerator/sessionCreatedEmailContentGenerator";
import { EmailService } from "@infrastructure/services/Email/emailService";
import { StorageService } from "@infrastructure/services/storageService";

import { CreateTicketWithSessionUseCase } from "application/useCases/Ticket/createTicketWithSessionUseCase";
import { GetTicketByIdUseCase } from "application/useCases/Ticket/getTicketByIdUseCase";
import { GetTicketsByFounderUseCase } from "application/useCases/Ticket/getTicketsByFounderUseCase";
import { GetTicketsByInvestorUseCase } from "application/useCases/Ticket/getTicketsByInvestorUseCase";
import { TicketController } from "interfaceAdapters/controller/Ticket/ticketController";

// repositories
const ticketRepo = new TicketRepository(ticketModel);
const sessionRepo = new SessionRepository(sessionModel);
const projectRepo = new ProjectRepository(projectModel);
const userRepo = new UserRepository(userModel);
const emailService = new EmailService();
const storageService = new StorageService();
const sessionEmailTemplate = new SessionCreatedEmailContentGenerator();

// use case
const createTicketWithSessionUseCase = new CreateTicketWithSessionUseCase(
  ticketRepo,
  sessionRepo,
  projectRepo,
  userRepo,
  emailService,
  sessionEmailTemplate
);
const getTicketsByInvestorUseCase = new GetTicketsByInvestorUseCase(ticketRepo, storageService);
const getTicketsByFounderUseCase = new GetTicketsByFounderUseCase(ticketRepo, storageService);
const getTicketByIdUseCase = new GetTicketByIdUseCase(ticketRepo, storageService);

// controller
export const ticketController = new TicketController(
  createTicketWithSessionUseCase,
  getTicketsByInvestorUseCase,
  getTicketsByFounderUseCase,
  getTicketByIdUseCase
);

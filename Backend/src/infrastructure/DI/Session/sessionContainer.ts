import { investorModel } from "@infrastructure/db/models/investorModel";
import { projectModel } from "@infrastructure/db/models/projectModel";
import { sessionModel } from "@infrastructure/db/models/sessionModel";
import { userModel } from "@infrastructure/db/models/userModel";
import { InvestorRepository } from "@infrastructure/repostiories/investorRepository";
import { ProjectRepository } from "@infrastructure/repostiories/projectRepository";
import { SessionRepository } from "@infrastructure/repostiories/sessionRepository";
import { UserRepository } from "@infrastructure/repostiories/userRepository";
import { SessionCancelledEmailContentGenerator } from "@infrastructure/services/Email/EmailContentGenerator/sessionCancelledEmailContentGenerator";
import { EmailService } from "@infrastructure/services/Email/emailService";
import { CancelSessionUseCase } from "application/useCases/Session/cancelSessionUseCase";
import { CreateSessionFeedbackUseCase } from "application/useCases/Session/createSessionFeedbackUseCase";
import { SessionController } from "interfaceAdapters/controller/Session/sessionController";

const sessionrepo = new SessionRepository(sessionModel);
const userRepo = new UserRepository(userModel);
const investorRepo = new InvestorRepository(investorModel);
const projectRepo = new ProjectRepository(projectModel);
const emailService = new EmailService();
const cancelEmailTemplate = new SessionCancelledEmailContentGenerator();

const cancelSessionUseCase = new CancelSessionUseCase(
  sessionrepo,
  userRepo,
  investorRepo,
  projectRepo,
  emailService,
  cancelEmailTemplate
);

const createSessionFeedbackUseCase = new CreateSessionFeedbackUseCase(sessionrepo);

export const sessionController = new SessionController(
  cancelSessionUseCase,
  createSessionFeedbackUseCase
);

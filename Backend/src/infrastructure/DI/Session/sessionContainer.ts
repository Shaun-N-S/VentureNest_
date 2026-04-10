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
import { ApproveUserUseCase } from "application/useCases/Session/approveUserUseCase";
import { CancelSessionUseCase } from "application/useCases/Session/cancelSessionUseCase";
import { CreateSessionFeedbackUseCase } from "application/useCases/Session/createSessionFeedbackUseCase";
import { GetSessionStatusUseCase } from "application/useCases/Session/getSessionStatusUseCase";
import { JoinSessionUseCase } from "application/useCases/Session/joinSessionUseCase";
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
const joinSessionUseCase = new JoinSessionUseCase(sessionrepo, userRepo);
const approveUserUseCase = new ApproveUserUseCase(sessionrepo, userRepo);
const getSessionStatusUseCase = new GetSessionStatusUseCase(sessionrepo);

export const sessionController = new SessionController(
  cancelSessionUseCase,
  createSessionFeedbackUseCase,
  joinSessionUseCase,
  approveUserUseCase,
  getSessionStatusUseCase
);

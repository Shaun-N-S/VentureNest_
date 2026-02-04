import { IProjectRepository } from "@domain/interfaces/repositories/IProjectRepository";
import { ISessionRepository } from "@domain/interfaces/repositories/ISessionRepository";
import { ITicketRepository } from "@domain/interfaces/repositories/ITicketRepository";
import { PROJECT_ERRORS } from "@shared/constants/error";
import { NotFoundExecption } from "application/constants/exceptions";
import { CreateTicketWithSessionDTO } from "application/dto/ticket/CreateTicketWithSessionDTO";
import { TicketMapper } from "application/mappers/ticketMapper";
import { SessionMapper } from "application/mappers/sessionMapper";
import { ICreateTicketWithSessionUseCase } from "@domain/interfaces/useCases/ticket/ICreateTicketWithSessionUseCase ";
import { IUserRepository } from "@domain/interfaces/repositories/IUserRepository";
import { IEmailService } from "@domain/interfaces/services/IEmail/IEmailService";
import { ISessionCreatedEmailContentGenerator } from "@domain/interfaces/services/IEmail/ISessionCreatedEmailTemplate";

export class CreateTicketWithSessionUseCase implements ICreateTicketWithSessionUseCase {
  constructor(
    private _ticketRepo: ITicketRepository,
    private _sessionRepo: ISessionRepository,
    private _projectRepo: IProjectRepository,
    private _userRepo: IUserRepository,
    private _emailService: IEmailService,
    private _sessionEmailTemplate: ISessionCreatedEmailContentGenerator
  ) {}

  async execute(
    data: CreateTicketWithSessionDTO
  ): Promise<{ ticketId: string; sessionId: string }> {
    const project = await this._projectRepo.findById(data.projectId);
    if (!project || !project._id) {
      throw new NotFoundExecption(PROJECT_ERRORS.NO_PROJECTS_FOUND);
    }

    let ticket = await this._ticketRepo.findByInvestorAndProject(data.investorId, data.projectId);

    if (!ticket) {
      ticket = await this._ticketRepo.save(
        TicketMapper.createFromProject({
          project: {
            _id: project._id,
            userId: project.userId,
            startupName: project.startupName,
          },
          investorId: data.investorId,
          initialStage: data.initialStage,
        })
      );
    }

    const sessionStartTime = data.startTime
      ? new Date(`${data.date.toISOString().split("T")[0]}T${data.startTime}:00`)
      : undefined;

    const session = await this._sessionRepo.save(
      SessionMapper.createFromTicket({
        ticketId: ticket._id!,
        project: {
          _id: project._id,
          userId: project.userId,
        },
        investorId: data.investorId,
        sessionName: data.sessionName,
        date: data.date,
        duration: data.duration,
        stage: data.initialStage,
        ...(sessionStartTime && { startTime: sessionStartTime }),
      })
    );

    const founder = await this._userRepo.findById(project.userId);
    if (founder?.email) {
      const emailContent = this._sessionEmailTemplate.generateHtml({
        founderName: founder.userName,
        projectName: project.startupName,
        sessionName: data.sessionName,
        date: data.date,
        duration: data.duration,
      });

      await this._emailService.sendEmail({
        receiverEmail: founder.email,
        subject: "New Session Scheduled on VentureNest",
        content: emailContent,
      });
    }

    return {
      ticketId: ticket._id!,
      sessionId: session._id!,
    };
  }
}

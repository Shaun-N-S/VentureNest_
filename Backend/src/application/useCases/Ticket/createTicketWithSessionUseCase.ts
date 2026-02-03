import { IProjectRepository } from "@domain/interfaces/repositories/IProjectRepository";
import { ISessionRepository } from "@domain/interfaces/repositories/ISessionRepository";
import { ITicketRepository } from "@domain/interfaces/repositories/ITicketRepository";
import { PROJECT_ERRORS } from "@shared/constants/error";
import { NotFoundExecption } from "application/constants/exceptions";
import { CreateTicketWithSessionDTO } from "application/dto/ticket/CreateTicketWithSessionDTO";
import { TicketMapper } from "application/mappers/ticketMapper";
import { SessionMapper } from "application/mappers/sessionMapper";
import { ICreateTicketWithSessionUseCase } from "@domain/interfaces/useCases/ticket/ICreateTicketWithSessionUseCase ";

export class CreateTicketWithSessionUseCase implements ICreateTicketWithSessionUseCase {
  constructor(
    private readonly _ticketRepo: ITicketRepository,
    private readonly _sessionRepo: ISessionRepository,
    private readonly _projectRepo: IProjectRepository
  ) {}

  async execute(
    data: CreateTicketWithSessionDTO
  ): Promise<{ ticketId: string; sessionId: string }> {
    const project = await this._projectRepo.findById(data.projectId);
    if (!project || !project._id) {
      throw new NotFoundExecption(PROJECT_ERRORS.NO_PROJECTS_FOUND);
    }

    const projectRef = {
      _id: project._id,
      userId: project.userId,
      startupName: project.startupName,
    };

    const ticket = await this._ticketRepo.save(
      TicketMapper.createFromProject({
        project: projectRef,
        investorId: data.investorId,
        discussionLevel: data.discussionLevel,
      })
    );

    const sessionDateTime =
      data.startTime && data.date
        ? new Date(`${data.date.toISOString().split("T")[0]}T${data.startTime}:00`)
        : undefined;

    const session = await this._sessionRepo.save(
      SessionMapper.createFromTicket({
        ticketId: ticket._id!,
        project: {
          _id: projectRef._id,
          userId: projectRef.userId,
        },
        investorId: data.investorId,
        sessionName: data.sessionName,
        date: data.date,
        duration: data.duration,
        startTime: sessionDateTime,
        description: data.description,
      })
    );

    return {
      ticketId: ticket._id!,
      sessionId: session._id!,
    };
  }
}

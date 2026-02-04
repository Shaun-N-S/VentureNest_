import { ISessionRepository } from "@domain/interfaces/repositories/ISessionRepository";
import { ICancelSessionUseCase } from "@domain/interfaces/useCases/session/ICancelSessionUseCase";
import { CancelSessionDTO } from "application/dto/session/CancelSessionDTO";
import { CancelledSessionResponseDTO } from "application/dto/session/CancelledSessionResponseDTO";
import { NotFoundExecption, ForbiddenException } from "application/constants/exceptions";
import { SessionStatus } from "@domain/enum/sessionStatus";
import { Errors, SESSION_ERRORS } from "@shared/constants/error";
import { IUserRepository } from "@domain/interfaces/repositories/IUserRepository";
import { IProjectRepository } from "@domain/interfaces/repositories/IProjectRepository";
import { IEmailService } from "@domain/interfaces/services/IEmail/IEmailService";
import { ISessionCancelledEmailContentGenerator } from "@domain/interfaces/services/IEmail/ISessionCancelledEmailContentGenerator";
import { IInvestorRepository } from "@domain/interfaces/repositories/IInvestorRespository";

export class CancelSessionUseCase implements ICancelSessionUseCase {
  constructor(
    private readonly _sessionRepo: ISessionRepository,
    private readonly _userRepo: IUserRepository,
    private _investorRepo: IInvestorRepository,
    private readonly _projectRepo: IProjectRepository,
    private readonly _emailService: IEmailService,
    private readonly _cancelEmailTemplate: ISessionCancelledEmailContentGenerator
  ) {}

  async execute(data: CancelSessionDTO): Promise<CancelledSessionResponseDTO> {
    const session = await this._sessionRepo.findById(data.sessionId);

    if (!session) {
      throw new NotFoundExecption(SESSION_ERRORS.SESSION_NOT_FOUND);
    }

    if (session.status === SessionStatus.CANCELLED) {
      throw new ForbiddenException(SESSION_ERRORS.SESSION_ALREADY_CANCELLED);
    }

    if (data.cancelledBy === "INVESTOR" && session.investorId !== data.userId) {
      throw new ForbiddenException(Errors.NOT_ALLOWED);
    }

    if (data.cancelledBy === "USER" && session.founderId !== data.userId) {
      throw new ForbiddenException(Errors.NOT_ALLOWED);
    }

    const updated = await this._sessionRepo.cancelSession(
      data.sessionId,
      data.cancelledBy,
      data.reason
    );

    if (!updated) {
      throw new NotFoundExecption(SESSION_ERRORS.SESSION_NOT_FOUND);
    }

    const project = await this._projectRepo.findById(session.projectId);

    if (!project) {
      return {
        sessionId: updated._id!,
        status: updated.status,
        cancelledBy: updated.cancelledBy!,
        cancelReason: updated.cancelReason!,
        updatedAt: updated.updatedAt!,
      };
    }

    let receiverEmail: string | undefined;
    let receiverName: string | undefined;

    if (data.cancelledBy === "INVESTOR") {
      const founder = await this._userRepo.findById(session.founderId);
      receiverEmail = founder?.email;
      receiverName = founder?.userName;
    } else {
      const investor = await this._investorRepo.findById(session.investorId);
      receiverEmail = investor?.email;
      receiverName = investor?.userName;
    }

    if (receiverEmail && receiverName) {
      const emailHtml = this._cancelEmailTemplate.generateHtml({
        receiverName,
        projectName: project.startupName,
        sessionName: session.sessionName,
        cancelledBy: data.cancelledBy,
        reason: data.reason,
        date: session.date,
      });

      await this._emailService.sendEmail({
        receiverEmail,
        subject: "Session Cancelled on VentureNest",
        content: emailHtml,
      });
    }

    return {
      sessionId: updated._id!,
      status: updated.status,
      cancelledBy: updated.cancelledBy!,
      cancelReason: updated.cancelReason!,
      updatedAt: updated.updatedAt!,
    };
  }
}

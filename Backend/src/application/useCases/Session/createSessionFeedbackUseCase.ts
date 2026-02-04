import { ISessionRepository } from "@domain/interfaces/repositories/ISessionRepository";
import { ICreateSessionFeedbackUseCase } from "@domain/interfaces/useCases/session/ICreateSessionFeedbackUseCase";
import { AddSessionFeedbackDTO } from "application/dto/session/AddSessionFeedbackDTO";
import { SessionFeedbackResponseDTO } from "application/dto/session/SessionFeedbackResponseDTO";
import { ForbiddenException, NotFoundExecption } from "application/constants/exceptions";
import { SessionStatus } from "@domain/enum/sessionStatus";
import { SESSION_ERRORS, Errors } from "@shared/constants/error";

export class CreateSessionFeedbackUseCase implements ICreateSessionFeedbackUseCase {
  constructor(private readonly _sessionRepo: ISessionRepository) {}

  async execute(data: AddSessionFeedbackDTO): Promise<SessionFeedbackResponseDTO> {
    const session = await this._sessionRepo.findById(data.sessionId);

    if (!session) {
      throw new NotFoundExecption(SESSION_ERRORS.SESSION_NOT_FOUND);
    }

    if (session.status === SessionStatus.CANCELLED) {
      throw new ForbiddenException(SESSION_ERRORS.CANNOT_FEEDBACK_CANCELLED_SESSION);
    }

    if (session.status === SessionStatus.COMPLETED) {
      throw new ForbiddenException(SESSION_ERRORS.FEEDBACK_ALREADY_SUBMITTED);
    }

    if (session.investorId !== data.investorId) {
      throw new ForbiddenException(Errors.NOT_ALLOWED);
    }

    const updated = await this._sessionRepo.addFeedback(
      data.sessionId,
      data.feedback,
      data.decision
    );

    if (!updated) {
      throw new NotFoundExecption(SESSION_ERRORS.SESSION_NOT_FOUND);
    }

    return {
      sessionId: updated._id!,
      status: updated.status,
      feedback: updated.feedback!,
      decision: updated.decision!,
      updatedAt: updated.updatedAt!,
    };
  }
}

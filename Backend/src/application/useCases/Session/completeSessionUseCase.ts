import { ISessionRepository } from "@domain/interfaces/repositories/ISessionRepository";
import { SessionStatus } from "@domain/enum/sessionStatus";
import { ForbiddenException, NotFoundExecption } from "application/constants/exceptions";
import { ICompleteSessionUseCase } from "@domain/interfaces/useCases/session/ICompleteSessionUseCase";

export class CompleteSessionUseCase implements ICompleteSessionUseCase {
  constructor(private _sessionRepo: ISessionRepository) {}

  async execute(sessionId: string, userId: string): Promise<void> {
    const session = await this._sessionRepo.findById(sessionId);

    if (!session) {
      throw new NotFoundExecption("Session not found");
    }

    if (session.investorId !== userId) {
      throw new ForbiddenException("Only host can complete session");
    }

    await this._sessionRepo.update(sessionId, {
      status: SessionStatus.COMPLETED,
    });
  }
}

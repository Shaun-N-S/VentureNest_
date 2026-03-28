import { ISessionRepository } from "@domain/interfaces/repositories/ISessionRepository";
import { IJoinSessionUseCase } from "@domain/interfaces/useCases/session/IJoinSessionUseCase";
import { JoinSessionDTO, JoinSessionResponseDTO } from "application/dto/session/JoinSessionDTO";
import { NotFoundExecption } from "application/constants/exceptions";
import { SESSION_ERRORS } from "@shared/constants/error";

export class JoinSessionUseCase implements IJoinSessionUseCase {
  constructor(private _sessionRepo: ISessionRepository) {}

  async execute(data: JoinSessionDTO): Promise<JoinSessionResponseDTO> {
    const session = await this._sessionRepo.findById(data.sessionId);

    if (!session) {
      throw new NotFoundExecption(SESSION_ERRORS.SESSION_NOT_FOUND);
    }

    const updated = await this._sessionRepo.joinSession(data.sessionId, data.userId);

    if (!updated) {
      throw new NotFoundExecption(SESSION_ERRORS.SESSION_NOT_FOUND);
    }

    // determine role
    if (updated.investorId === data.userId) {
      return { role: "host" };
    }

    return { role: "waiting" };
  }
}

import { ISessionRepository } from "@domain/interfaces/repositories/ISessionRepository";
import { IGetSessionStatusUseCase } from "@domain/interfaces/useCases/session/IGetSessionStatusUseCase";
import {
  GetSessionStatusDTO,
  GetSessionStatusResponseDTO,
} from "application/dto/session/GetSessionStatusDTO";
import { NotFoundExecption, ForbiddenException } from "application/constants/exceptions";
import { SESSION_ERRORS, Errors } from "@shared/constants/error";

export class GetSessionStatusUseCase implements IGetSessionStatusUseCase {
  constructor(private _sessionRepo: ISessionRepository) {}

  async execute(data: GetSessionStatusDTO): Promise<GetSessionStatusResponseDTO> {
    const session = await this._sessionRepo.findById(data.sessionId);

    if (!session) {
      throw new NotFoundExecption(SESSION_ERRORS.SESSION_NOT_FOUND);
    }

    if (session.investorId === data.userId) {
      return {
        role: "host",
        hostJoined: session.hostJoined || false,
      };
    }

    const isAllowed = session.allowedUsers?.some((id) => id.toString() === data.userId);

    if (isAllowed) {
      return {
        role: "allowed",
        hostJoined: session.hostJoined || false,
      };
    }

    const isWaiting = session.waitingUsers?.some((id) => id.toString() === data.userId);

    if (isWaiting) {
      return {
        role: "waiting",
        hostJoined: session.hostJoined || false,
      };
    }

    throw new ForbiddenException(Errors.NOT_ALLOWED);
  }
}

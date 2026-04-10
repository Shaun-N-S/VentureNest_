import { ISessionRepository } from "@domain/interfaces/repositories/ISessionRepository";
import { IJoinSessionUseCase } from "@domain/interfaces/useCases/session/IJoinSessionUseCase";
import { JoinSessionDTO, JoinSessionResponseDTO } from "application/dto/session/JoinSessionDTO";
import { ForbiddenException, NotFoundExecption } from "application/constants/exceptions";
import { SESSION_ERRORS } from "@shared/constants/error";
import { io } from "@infrastructure/realtime/socketServer";
import { SocketRooms } from "@infrastructure/realtime/socketRooms";
import { IUserRepository } from "@domain/interfaces/repositories/IUserRepository";

export class JoinSessionUseCase implements IJoinSessionUseCase {
  constructor(
    private _sessionRepo: ISessionRepository,
    private _userRepo: IUserRepository
  ) {}

  async execute(data: JoinSessionDTO): Promise<JoinSessionResponseDTO> {
    const session = await this._sessionRepo.findById(data.sessionId);

    if (!session) {
      throw new NotFoundExecption(SESSION_ERRORS.SESSION_NOT_FOUND);
    }

    const now = new Date();

    if (!session.startTime) {
      throw new ForbiddenException(SESSION_ERRORS.NOT_STARTED_YET);
    }

    const start = new Date(session.startTime);
    const end = new Date(start.getTime() + session.duration * 60000);

    if (now < start) {
      throw new ForbiddenException(SESSION_ERRORS.NOT_STARTED_YET);
    }

    if (now > end) {
      throw new ForbiddenException(SESSION_ERRORS.ENDED);
    }

    const updated = await this._sessionRepo.joinSession(data.sessionId, data.userId);

    if (!updated) {
      throw new NotFoundExecption(SESSION_ERRORS.SESSION_NOT_FOUND);
    }

    const users = await this._userRepo.findByIds(updated.waitingUsers || []);

    const waitingUsers = users.map((user) => ({
      userId: user._id!,
      name: user.userName,
    }));

    io.to(SocketRooms.session(data.sessionId)).emit("session:waiting-list-updated", {
      waitingUsers,
    });

    if (updated.investorId === data.userId) {
      return { role: "host" };
    }

    return { role: "waiting" };
  }
}

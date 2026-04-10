import { ISessionRepository } from "@domain/interfaces/repositories/ISessionRepository";
import { IApproveUserUseCase } from "@domain/interfaces/useCases/session/IApproveUserUseCase";
import { ApproveUserDTO, ApproveUserResponseDTO } from "application/dto/session/ApproveUserDTO";
import { ForbiddenException, NotFoundExecption } from "application/constants/exceptions";
import { SESSION_ERRORS, Errors } from "@shared/constants/error";
import { io } from "@infrastructure/realtime/socketServer";
import { SocketRooms } from "@infrastructure/realtime/socketRooms";
import { IUserRepository } from "@domain/interfaces/repositories/IUserRepository";

export class ApproveUserUseCase implements IApproveUserUseCase {
  constructor(
    private _sessionRepo: ISessionRepository,
    private _userRepo: IUserRepository
  ) {}

  async execute(data: ApproveUserDTO): Promise<ApproveUserResponseDTO> {
    const session = await this._sessionRepo.findById(data.sessionId);

    if (!session) {
      throw new NotFoundExecption(SESSION_ERRORS.SESSION_NOT_FOUND);
    }

    if (session.investorId !== data.investorId) {
      throw new ForbiddenException(Errors.NOT_ALLOWED);
    }

    const isWaiting = session.waitingUsers?.some((id) => id.toString() === data.userId);

    if (!isWaiting) {
      throw new ForbiddenException(SESSION_ERRORS.USER_NOT_FOUND);
    }

    const updated = await this._sessionRepo.approveUser(data.sessionId, data.userId);

    if (!updated) {
      throw new NotFoundExecption(SESSION_ERRORS.SESSION_NOT_FOUND);
    }

    const users = await this._userRepo.findByIds(updated.waitingUsers || []);

    const waitingUsers = users.map((user) => ({
      userId: user._id!,
      name: user.userName,
    }));

    io.to(SocketRooms.user(data.userId.toString())).emit("session:approved", {
      sessionId: data.sessionId,
    });

    io.to(SocketRooms.session(data.sessionId)).emit("session:waiting-list-updated", {
      waitingUsers,
    });

    return {
      approvedUserId: data.userId,
    };
  }
}

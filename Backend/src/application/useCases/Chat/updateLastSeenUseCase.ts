import { IUserRepository } from "@domain/interfaces/repositories/IUserRepository";
import { IInvestorRepository } from "@domain/interfaces/repositories/IInvestorRespository";
import { IUpdateLastSeenUseCase } from "@domain/interfaces/useCases/chat/IUpdateLastSeenUseCase";
import { UserRole } from "@domain/enum/userRole";

export class UpdateLastSeenUseCase implements IUpdateLastSeenUseCase {
  constructor(
    private userRepo: IUserRepository,
    private investorRepo: IInvestorRepository
  ) {}

  async execute(userId: string, role: string): Promise<void> {
    const now = new Date();

    if (role === UserRole.USER) {
      await this.userRepo.updateLastSeen(userId, now);
    } else {
      await this.investorRepo.updateLastSeen(userId, now);
    }
  }
}

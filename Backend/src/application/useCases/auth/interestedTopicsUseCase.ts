import { PreferredSector } from "@domain/enum/preferredSector";
import { IInvestorRepository } from "@domain/interfaces/repositories/IInvestorRespository";
import { IUserRepository } from "@domain/interfaces/repositories/IUserRepository";
import { IInterestedTopicsUseCase } from "@domain/interfaces/useCases/auth/IInterestedTopicsUseCase";
import { USER_ERRORS } from "@shared/constants/error";
import { NotFoundExecption } from "application/constants/exceptions";

export class InterestedTopicsUseCase implements IInterestedTopicsUseCase {
  constructor(
    private _userRepository: IUserRepository,
    private _investorRepository: IInvestorRepository
  ) {}

  async setTopics(id: string, topics: PreferredSector[]): Promise<void> {
    const [userData, investorData] = await Promise.all([
      this._userRepository.findById(id),
      this._investorRepository.findById(id),
    ]);

    if (!userData && !investorData) {
      throw new NotFoundExecption(USER_ERRORS.NO_USERS_FOUND);
    }

    if (userData) {
      userData.interestedTopics = topics;
      await this._userRepository.setInterestedTopics(id, userData.interestedTopics);
    }

    if (investorData) {
      investorData.interestedTopics = topics;
      await this._investorRepository.setInterestedTopics(id, investorData.interestedTopics);
    }
  }
}

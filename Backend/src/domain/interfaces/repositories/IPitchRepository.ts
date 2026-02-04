import { PitchEntity } from "@domain/entities/pitch/pitchEntity";
import { IBaseRepository } from "./IBaseRepository";
import { PitchStatus } from "@domain/enum/pitchStatus";

export interface IPitchRepository extends IBaseRepository<PitchEntity> {
  findSentByFounder(founderId: string): Promise<PitchEntity[]>;
  findReceivedByInvestor(investorId: string): Promise<PitchEntity[]>;
  updateStatus(pitchId: string, status: PitchStatus): Promise<PitchEntity | null>;
}
